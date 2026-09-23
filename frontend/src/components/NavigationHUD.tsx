import React from 'react';
import {
    ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight,
    ArrowDown, CornerUpRight, Layers, Navigation2,
    CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react';

interface NavigationHUDProps {
    instructions: string[];
    currentStep: number;
    totalSteps: number;
    distance: number;
    estimatedTime: number;
    path: string[];
    graphData: any;
    currentFloor: number;
    onConfirmStep: () => void;
    isComplete: boolean;
    startNode?: string;
    endNode?: string;
}

const getDirectionIcon = (instruction: string) => {
    const t = instruction.toLowerCase();
    if (t.includes('turn right'))        return <ArrowUpRight size={56} className="text-white" />;
    if (t.includes('turn left'))         return <ArrowUpRight size={56} className="text-white rotate-[-90deg]" />;
    if (t.includes('straight') || t.includes('continue'))  return <ArrowUp size={56} className="text-white" />;
    if (t.includes('stairs') || t.includes('staircase'))   return <TrendingUp size={56} className="text-white" />;
    if (t.includes('lift') || t.includes('elevator'))      return <Layers size={56} className="text-white" />;
    if (t.includes('arrived') || t.includes('destination')) return <CheckCircle size={56} className="text-green-300" />;
    if (t.includes('exit') || t.includes('leave'))         return <CornerUpRight size={56} className="text-white" />;
    return <Navigation2 size={56} className="text-white" />;
};

const getDirectionColor = (instruction: string) => {
    const t = instruction.toLowerCase();
    if (t.includes('arrived') || t.includes('destination')) return 'from-green-600 to-emerald-700';
    if (t.includes('stairs'))  return 'from-amber-600 to-orange-700';
    if (t.includes('lift'))    return 'from-purple-600 to-indigo-700';
    return 'from-blue-600 to-blue-800';
};

const extractDistance = (instruction: string): string | null => {
    const m = instruction.match(/(\d+)\s*m/);
    return m ? `${m[1]} m` : null;
};

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
    instructions, currentStep, totalSteps, distance,
    estimatedTime, graphData, currentFloor,
    onConfirmStep, isComplete, startNode, endNode
}) => {
    if (!instructions || instructions.length === 0) return null;

    const safeStep   = Math.min(currentStep, instructions.length - 1);
    const current    = instructions[safeStep];
    const next       = instructions[safeStep + 1];
    const progress   = totalSteps > 1 ? (safeStep / (totalSteps - 1)) * 100 : 100;
    const stepsLeft  = instructions.length - 1 - safeStep;
    const distInstr  = extractDistance(current);

    // Floor info for current step
    const currentPathNode = graphData?.nodes?.find((n: any) =>
        n.floor === currentFloor
    );

    return (
        <div className="flex flex-col gap-3 h-full">
            {/* ── MAIN HUD CARD ── */}
            <div className={`rounded-2xl bg-gradient-to-br ${getDirectionColor(current)} shadow-xl overflow-hidden`}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                        Step {safeStep + 1} of {instructions.length}
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                        <Layers size={12} />
                        Floor {currentFloor}
                    </div>
                </div>

                {/* Direction + instruction */}
                <div className="flex items-center gap-5 px-5 pb-4">
                    <div className="flex-shrink-0 bg-white/15 rounded-2xl p-3 flex items-center justify-center">
                        {getDirectionIcon(current)}
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-lg font-bold leading-snug">{current}</p>
                        {distInstr && (
                            <p className="text-white/70 text-sm mt-1 font-medium">{distInstr} ahead</p>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="bg-white/10 h-1.5 mx-5 mb-4 rounded-full overflow-hidden">
                    <div
                        className="bg-white h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-center shadow-sm">
                    <p className="text-xs text-slate-500 mb-0.5">Remaining</p>
                    <p className="text-base font-bold text-slate-800">{Math.round(distance - (distance * progress / 100))} m</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-center shadow-sm">
                    <p className="text-xs text-slate-500 mb-0.5">Est. Time</p>
                    <p className="text-base font-bold text-slate-800">~{estimatedTime}s</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-center shadow-sm">
                    <p className="text-xs text-slate-500 mb-0.5">Steps Left</p>
                    <p className="text-base font-bold text-slate-800">{stepsLeft}</p>
                </div>
            </div>

            {/* ── NEXT STEP PREVIEW ── */}
            {next && !isComplete && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm">
                    <div className="bg-slate-200 text-slate-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowDown size={14} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Then next</p>
                        <p className="text-sm text-slate-700 font-medium">{next}</p>
                    </div>
                </div>
            )}

            {/* ── CONFIRM BUTTON ── */}
            {!isComplete ? (
                <button
                    onClick={onConfirmStep}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle size={20} />
                    Yes, I'm here — Next Step
                </button>
            ) : (
                <div className="w-full bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    You have arrived!
                </div>
            )}

            {/* ── ALL STEPS COLLAPSIBLE LIST ── */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">All Steps</p>
                </div>
                <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto">
                    {instructions.map((inst, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
                                i === safeStep ? 'bg-blue-50 border-l-2 border-l-blue-500' :
                                i < safeStep   ? 'opacity-40' : ''
                            }`}
                        >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                i < safeStep   ? 'bg-green-100 text-green-600' :
                                i === safeStep ? 'bg-blue-600 text-white' :
                                                 'bg-slate-100 text-slate-500'
                            }`}>
                                {i < safeStep ? '✓' : i + 1}
                            </span>
                            <p className={`text-sm leading-snug ${i === safeStep ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}>
                                {inst}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
