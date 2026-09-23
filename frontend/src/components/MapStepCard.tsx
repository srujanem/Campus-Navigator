import React from 'react';
import {
    ArrowUp, ArrowUpRight, ArrowDownRight, TrendingUp,
    Layers, CheckCircle, CornerUpRight, Navigation2,
    ChevronRight, ChevronLeft
} from 'lucide-react';

interface StepCardProps {
    instruction: string;
    stepNum: number;
    totalSteps: number;
    nextInstruction?: string;
    distanceRemaining: number;
    currentFloor: number;
    isComplete: boolean;
    onNext: () => void;
    onPrev: () => void;
}

const directionIcon = (inst: string) => {
    const t = inst.toLowerCase();
    const cls = "flex-shrink-0";
    if (t.includes('arrived') || t.includes('destination')) return <CheckCircle size={28} className={`${cls} text-green-500`} />;
    if (t.includes('stairs') || t.includes('staircase'))   return <TrendingUp   size={28} className={`${cls} text-amber-500`} />;
    if (t.includes('lift') || t.includes('elevator'))      return <Layers        size={28} className={`${cls} text-purple-500`} />;
    if (t.includes('turn right'))                          return <ArrowUpRight  size={28} className={`${cls} text-blue-600`}  />;
    if (t.includes('turn left'))                           return <ArrowDownRight size={28} className={`${cls} text-blue-600 scale-x-[-1]`} />;
    if (t.includes('exit') || t.includes('leave'))         return <CornerUpRight size={28} className={`${cls} text-blue-600`}  />;
    if (t.includes('continue') || t.includes('straight'))  return <ArrowUp       size={28} className={`${cls} text-blue-600`}  />;
    return <Navigation2 size={28} className={`${cls} text-blue-600`} />;
};

const cardColor = (inst: string): string => {
    const t = inst.toLowerCase();
    if (t.includes('arrived') || t.includes('destination')) return 'bg-green-600';
    if (t.includes('stairs'))  return 'bg-amber-500';
    if (t.includes('lift'))    return 'bg-purple-600';
    return 'bg-blue-600';
};

export const MapStepCard: React.FC<StepCardProps> = ({
    instruction, stepNum, totalSteps, nextInstruction,
    distanceRemaining, currentFloor, isComplete,
    onNext, onPrev
}) => {
    const progress = ((stepNum) / (totalSteps - 1)) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full max-w-xl">
            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
                <div className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }} />
            </div>

            {/* Main instruction row */}
            <div className="flex items-center gap-4 px-5 py-4">
                {/* Icon badge */}
                <div className={`${cardColor(instruction)} rounded-xl p-2.5 flex items-center justify-center flex-shrink-0`}>
                    {directionIcon(instruction)}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-bold text-base leading-snug">{instruction}</p>
                    {nextInstruction && !isComplete && (
                        <p className="text-slate-400 text-xs mt-1 truncate">Then: {nextInstruction}</p>
                    )}
                </div>

                {/* Step counter */}
                <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400 font-semibold">{stepNum + 1}/{totalSteps}</p>
                    <p className="text-xs text-slate-500">Floor {currentFloor}</p>
                </div>
            </div>

            {/* Bottom controls row */}
            <div className="flex items-center justify-between px-4 pb-3 gap-3">
                {/* Distance */}
                <div className="text-xs text-slate-500 font-medium">
                    ~{distanceRemaining} m remaining
                </div>

                {/* Prev / Next buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onPrev}
                        disabled={stepNum === 0}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>

                    {!isComplete ? (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors active:scale-95"
                        >
                            <CheckCircle size={14} /> I'm here <ChevronRight size={14} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold">
                            <CheckCircle size={14} /> Arrived!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
