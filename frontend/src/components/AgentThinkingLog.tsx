import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export interface AgentThought {
    step: string;
    detail: string;
    status: 'thinking' | 'done' | 'error';
    timestamp: string;
}

interface AgentThinkingLogProps {
    thoughts: AgentThought[];
    isThinking: boolean;
}

const statusColor = (s: string) => {
    if (s === 'done')     return 'text-green-400';
    if (s === 'error')    return 'text-red-400';
    return 'text-yellow-400';
};

const statusDot = (s: string) => {
    if (s === 'done')  return 'bg-green-400';
    if (s === 'error') return 'bg-red-400';
    return 'bg-yellow-400 animate-pulse';
};

export const AgentThinkingLog: React.FC<AgentThinkingLogProps> = ({ thoughts, isThinking }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-700 shadow-lg font-mono text-xs">
            {/* Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-750 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Cpu size={13} className="text-blue-400" />
                    <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                        Agent Reasoning Log
                    </span>
                    {isThinking && (
                        <span className="flex items-center gap-1 text-yellow-400 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                            thinking
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
            </button>

            {open && (
                <div className="p-3 space-y-1.5 max-h-56 overflow-y-auto">
                    {thoughts.length === 0 && (
                        <p className="text-slate-600 italic">
                            {'>'} Awaiting query…
                        </p>
                    )}
                    {thoughts.map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${statusDot(t.status)}`} />
                            <div>
                                <span className={`font-bold ${statusColor(t.status)}`}>[{t.step}]</span>{' '}
                                <span className="text-slate-300">{t.detail}</span>
                                <span className="text-slate-600 ml-2">{t.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-center gap-2 text-yellow-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" />
                            <span>processing</span>
                            <span className="animate-pulse">…</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── helper to build thought logs programmatically ─── */
export const buildThoughts = (
    query: string,
    resolvedId: string | null,
    routeResult: any | null,
    error?: string
): AgentThought[] => {
    const now = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
    const thoughts: AgentThought[] = [];

    thoughts.push({
        step: 'PARSE',
        detail: `Received query: "${query}"`,
        status: 'done',
        timestamp: now()
    });

    if (query.match(/\d{3}/)) {
        thoughts.push({
            step: 'EXTRACT',
            detail: `Detected room number: ${query.match(/\d{3}/)?.[0]}`,
            status: 'done',
            timestamp: now()
        });
    } else {
        thoughts.push({
            step: 'EXTRACT',
            detail: `Parsed intent: keyword match on "${query.split(' ').pop()}"`,
            status: 'done',
            timestamp: now()
        });
    }

    if (resolvedId) {
        thoughts.push({
            step: 'RESOLVE',
            detail: `Destination resolved → node_id = "${resolvedId}"`,
            status: 'done',
            timestamp: now()
        });
        thoughts.push({
            step: 'GRAPH',
            detail: `Loading spatial graph — Block A, all floors`,
            status: 'done',
            timestamp: now()
        });
        thoughts.push({
            step: 'A*',
            detail: `Running A* algorithm from start → ${resolvedId}`,
            status: 'done',
            timestamp: now()
        });
    }

    if (routeResult) {
        thoughts.push({
            step: 'ROUTE',
            detail: `Route found: ${routeResult.path?.length} nodes, ${routeResult.distance}m, ${routeResult.instructions?.length} steps`,
            status: 'done',
            timestamp: now()
        });
        thoughts.push({
            step: 'OUTPUT',
            detail: `Generating turn-by-turn directions → TTS ready`,
            status: 'done',
            timestamp: now()
        });
    }

    if (error) {
        thoughts.push({
            step: 'ERROR',
            detail: error,
            status: 'error',
            timestamp: now()
        });
    }

    return thoughts;
};
