import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface CampusMap3DProps {
    graphData: any;
    currentFloor: number;
    path: string[];
    simulatedStep?: number;
    startNode?: string;
    endNode?: string;
}

const SCALE_XY = 40;
const FLOOR_HEIGHT = 2.5;

const getNodePosition = (node: any) => {
    return [
        (node.x - 300) / SCALE_XY,
        node.floor * FLOOR_HEIGHT,
        (node.y - 200) / SCALE_XY
    ] as [number, number, number];
};

const BuildingArchitecture = ({ currentFloor }: { currentFloor: number }) => {
    const floors = [0, 1, 2, 3];
    const wallColor = "#f8fafc";
    const wallOpacity = 0.6; // slightly transparent to see the path inside
    
    return (
        <group>
            {floors.map(f => {
                const y = f * FLOOR_HEIGHT;
                const isCurrent = currentFloor === f;
                const opacity = isCurrent ? 0.8 : 0.1;
                const material = new THREE.MeshStandardMaterial({ 
                    color: wallColor, 
                    transparent: true, 
                    opacity: opacity,
                    side: THREE.DoubleSide
                });

                return (
                    <group key={`arch_floor_${f}`} position={[0, y, 0]}>
                        {/* Floor Slab */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                            <planeGeometry args={[16, 8]} />
                            <meshStandardMaterial color={isCurrent ? "#e0f2fe" : "#cbd5e1"} transparent opacity={isCurrent ? 0.9 : 0.2} side={THREE.DoubleSide} />
                        </mesh>
                        
                        {/* Corridor North Wall (with gaps for doors) */}
                        <mesh position={[-2.5, 0.75, -0.8]} material={material}>
                            <boxGeometry args={[4, 1.5, 0.1]} />
                        </mesh>
                        <mesh position={[2.5, 0.75, -0.8]} material={material}>
                            <boxGeometry args={[4, 1.5, 0.1]} />
                        </mesh>

                        {/* Corridor South Wall */}
                        <mesh position={[-2.5, 0.75, 0.8]} material={material}>
                            <boxGeometry args={[4, 1.5, 0.1]} />
                        </mesh>
                        <mesh position={[2.5, 0.75, 0.8]} material={material}>
                            <boxGeometry args={[4, 1.5, 0.1]} />
                        </mesh>

                        {/* Exterior North Wall */}
                        <mesh position={[0, 0.75, -2.5]} material={material}>
                            <boxGeometry args={[12, 1.5, 0.1]} />
                        </mesh>
                        
                        {/* Exterior South Wall */}
                        <mesh position={[0, 0.75, 2.5]} material={material}>
                            <boxGeometry args={[12, 1.5, 0.1]} />
                        </mesh>

                        {/* Exterior West/East Walls */}
                        <mesh position={[-6, 0.75, 0]} material={material}>
                            <boxGeometry args={[0.1, 1.5, 5]} />
                        </mesh>
                        <mesh position={[6, 0.75, 0]} material={material}>
                            <boxGeometry args={[0.1, 1.5, 5]} />
                        </mesh>

                        {/* Room dividers */}
                        <mesh position={[-2.5, 0.75, -1.65]} material={material}>
                            <boxGeometry args={[0.1, 1.5, 1.7]} />
                        </mesh>
                        <mesh position={[2.5, 0.75, -1.65]} material={material}>
                            <boxGeometry args={[0.1, 1.5, 1.7]} />
                        </mesh>

                        {/* Visual Stairs A (West) & B (East) */}
                        {f < 3 && (
                            <group position={[-5.5, 0, 0]}>
                                {[0,1,2,3,4,5,6,7,8,9].map(step => (
                                    <mesh key={`sa_${step}`} position={[0, (step*FLOOR_HEIGHT)/10, (step*0.15)-0.75]}>
                                        <boxGeometry args={[0.8, FLOOR_HEIGHT/10, 0.15]} />
                                        <meshStandardMaterial color={isCurrent ? "#94a3b8" : "#cbd5e1"} transparent opacity={opacity} />
                                    </mesh>
                                ))}
                            </group>
                        )}
                        {f < 3 && (
                            <group position={[5.5, 0, 0]}>
                                {[0,1,2,3,4,5,6,7,8,9].map(step => (
                                    <mesh key={`sb_${step}`} position={[0, (step*FLOOR_HEIGHT)/10, (step*0.15)-0.75]}>
                                        <boxGeometry args={[0.8, FLOOR_HEIGHT/10, 0.15]} />
                                        <meshStandardMaterial color={isCurrent ? "#94a3b8" : "#cbd5e1"} transparent opacity={opacity} />
                                    </mesh>
                                ))}
                            </group>
                        )}

                        {/* Lift Box */}
                        <mesh position={[5.5, 0.75, 1.5]} material={material}>
                            <boxGeometry args={[1, 1.5, 1]} />
                        </mesh>

                        <Text position={[-7, 0.1, -3.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="#64748b">
                            Floor {f}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
};

const Scene: React.FC<CampusMap3DProps> = ({ graphData, currentFloor, path, simulatedStep, startNode, endNode }) => {
    const nodes = graphData?.nodes || [];

    // Separate active path edges
    const pathEdges = useMemo(() => {
        if (!path || path.length < 2) return [];
        const lines = [];
        for (let i = 0; i < path.length - 1; i++) {
            const source = nodes.find((n: any) => n.id === path[i]);
            const target = nodes.find((n: any) => n.id === path[i+1]);
            if (source && target) {
                // Add a small Y offset so the path sits slightly above the floor slab
                const p1 = getNodePosition(source);
                const p2 = getNodePosition(target);
                p1[1] += 0.05;
                p2[1] += 0.05;
                lines.push([p1, p2]);
            }
        }
        return lines;
    }, [path, nodes]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
            <OrbitControls target={[0, currentFloor * FLOOR_HEIGHT, 0]} maxPolarAngle={Math.PI / 2 - 0.1} />

            {/* Procedural Building Walls */}
            <BuildingArchitecture currentFloor={currentFloor} />

            {/* Render Path Highlight */}
            {pathEdges.map((points, idx) => (
                <Line 
                    key={`path_${idx}`}
                    points={points}
                    color="#2563eb"
                    lineWidth={8}
                />
            ))}

            {/* Render Target Destination Marker */}
            {endNode && (
                (() => {
                    const node = nodes.find((n: any) => n.id === endNode);
                    if (node) {
                        const pos = getNodePosition(node);
                        return (
                            <group position={[pos[0], pos[1] + 1.5, pos[2]]}>
                                <mesh>
                                    <coneGeometry args={[0.2, 0.5, 16]} />
                                    <meshStandardMaterial color="#ef4444" />
                                </mesh>
                                <Text position={[0, 0.5, 0]} fontSize={0.3} color="#ef4444" outlineColor="white" outlineWidth={0.02}>
                                    Destination
                                </Text>
                            </group>
                        );
                    }
                    return null;
                })()
            )}

            {/* Render Simulated Agent Marker */}
            {simulatedStep !== undefined && path[simulatedStep] && (
                (() => {
                    const currentNode = nodes.find((n: any) => n.id === path[simulatedStep]);
                    if (currentNode) {
                        const pos = getNodePosition(currentNode);
                        return (
                            <Sphere args={[0.2, 32, 32]} position={[pos[0], pos[1] + 0.2, pos[2]]}>
                                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
                            </Sphere>
                        );
                    }
                    return null;
                })()
            )}
        </>
    );
};

export const CampusMap3D: React.FC<CampusMap3DProps> = (props) => {
    return (
        <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-gray-200">
            {/* The canvas shows the 3D building. Users can rotate it. */}
            <Canvas camera={{ position: [0, 15, 15], fov: 45 }}>
                <Scene {...props} />
            </Canvas>
        </div>
    );
};
