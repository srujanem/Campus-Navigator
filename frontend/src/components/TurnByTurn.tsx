import React from 'react';
import { ArrowRight, CornerUpRight, ArrowUpFromLine, Navigation2 } from 'lucide-react';

interface TurnByTurnProps {
    instructions: string[];
    distance: number;
    time: number;
}

export const TurnByTurn: React.FC<TurnByTurnProps> = ({ instructions, distance, time }) => {
    if (!instructions || instructions.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mt-4">
            <div className="bg-green-500 text-white p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">Route Ready</h3>
                    <p className="text-green-100 text-sm">{distance} m • ~{time} sec</p>
                </div>
                <Navigation2 size={32} />
            </div>
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                {instructions.map((inst, idx) => {
                    let Icon = ArrowRight;
                    if (inst.toLowerCase().includes('stairs') || inst.toLowerCase().includes('lift')) Icon = ArrowUpFromLine;
                    else if (inst.toLowerCase().includes('turn')) Icon = CornerUpRight;
                    
                    return (
                        <div key={idx} className="flex items-start">
                            <div className="bg-gray-100 p-2 rounded-full mr-3 text-gray-600">
                                <Icon size={18} />
                            </div>
                            <p className="text-gray-800 pt-1 leading-tight">{inst}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
