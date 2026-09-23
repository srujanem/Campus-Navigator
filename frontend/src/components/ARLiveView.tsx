import React, { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, Navigation, Focus, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ARLiveViewProps {
    instruction: string;
    nextInstruction?: string;
    stepNum: number;
    totalSteps: number;
    distanceRemaining: number;
    currentNodeId?: string;
    onNext: () => void;
}

export const ARLiveView: React.FC<ARLiveViewProps> = ({
    instruction, nextInstruction, stepNum, totalSteps,
    distanceRemaining, currentNodeId, onNext
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCamera, setHasCamera] = useState<boolean | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [fps, setFps] = useState(30);
    const [logs, setLogs] = useState<string[]>([]);

    // Start Camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Camera API not supported or not HTTPS");
                }
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Rear camera on phones
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setHasCamera(true);
            } catch (err) {
                console.error("Camera error:", err);
                setHasCamera(false);
            }
        };
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Simulated SLAM / VLM processing loop
    useEffect(() => {
        if (!hasCamera) return;

        const interval = setInterval(() => {
            // Randomize FPS slightly to look real
            setFps(Math.floor(Math.random() * (32 - 28 + 1) + 28));

            // Generate fake analysis logs
            const rand = Math.random();
            let newLog = '';
            if (rand > 0.8) newLog = `[VLM] Detecting text in frame... None found.`;
            else if (rand > 0.6) newLog = `[SLAM] Feature points tracked: ${Math.floor(Math.random() * 200 + 400)}`;
            else if (rand > 0.4) newLog = `[SLAM] Pose estimation confidence: ${(Math.random() * 0.1 + 0.88).toFixed(2)}`;
            else newLog = `[LOCALIZE] Matched nearest node: ${currentNodeId || 'corridor'}`;

            setLogs(prev => [...prev.slice(-4), newLog]);
        }, 800);

        return () => clearInterval(interval);
    }, [hasCamera, currentNodeId]);

    // Parse instruction to get an arrow direction
    const getDirectionArrow = () => {
        const text = (instruction || '').toLowerCase();
        if (text.includes('right')) return '➔';
        if (text.includes('left')) return '⬅';
        if (text.includes('stairs') || text.includes('up')) return '⬈';
        if (text.includes('down')) return '⬊';
        if (text.includes('arrived') || text.includes('destination')) return '★';
        return '⬆'; // Straight by default
    };

    if (hasCamera === false) {
        return (
            <div className="h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-8 text-center rounded-xl">
                <ShieldAlert size={48} className="mb-4 text-slate-600" />
                <h3 className="text-white font-bold mb-2">Camera Access Denied</h3>
                <p className="text-sm">Please allow camera permissions to use AR Live View.</p>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-black rounded-xl overflow-hidden shadow-inner">
            {/* Real Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* AR Overlay Grid (Sci-fi effect) */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Center Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                <Focus size={120} className="text-blue-400" />
            </div>

            {/* Big AR Direction Arrow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] text-[100px] text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] font-black animate-pulse pointer-events-none">
                {getDirectionArrow()}
            </div>

            {/* Technical HUD Stats (Top Left) */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-green-400 font-mono text-[10px] p-3 rounded-lg border border-green-500/30 w-64 pointer-events-none">
                <div className="flex justify-between font-bold text-white mb-2">
                    <span>AR VISUAL SLAM</span>
                    <span className={fps > 29 ? 'text-green-400' : 'text-yellow-400'}>{fps} FPS</span>
                </div>
                <div className="space-y-1 opacity-80">
                    {logs.map((log, i) => (
                        <div key={i} className="truncate">{log}</div>
                    ))}
                </div>
            </div>

            {/* Destination Pin (Top Right) */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white p-3 rounded-lg border border-white/20 flex items-center gap-3">
                <MapPin className="text-red-500" size={20} />
                <div>
                    <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest">Target Acquired</p>
                    <p className="text-sm font-black">{distanceRemaining}m remaining</p>
                </div>
            </div>

            {/* Bottom Instruction Card (Interactive) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/50">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0">
                        {getDirectionArrow()}
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 font-black text-lg leading-tight">{instruction}</p>
                        {nextInstruction && (
                            <p className="text-slate-500 text-xs font-semibold mt-1 truncate">
                                Then: {nextInstruction}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-400">
                        Step {stepNum + 1} of {totalSteps}
                    </div>
                    <button
                        onClick={onNext}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
                    >
                        <Navigation size={16} /> I'm Here (Next)
                    </button>
                </div>
            </div>
        </div>
    );
};
