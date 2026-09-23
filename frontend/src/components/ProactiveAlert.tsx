import React, { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, X, Navigation } from 'lucide-react';

interface TimetableEntry {
    time: string;
    subject: string;
    room: string;
    node_id: string;
}

interface ProactiveAlertProps {
    timetable: TimetableEntry[];
    currentNodeId: string;
    routeCache: Record<string, any>; // node_id → pre-calc route
    onNavigate: (destId: string, destName: string) => void;
}

const WALK_SPEED_MPS = 1.0; // ~1 metre per second walking speed

export const ProactiveAlert: React.FC<ProactiveAlertProps> = ({
    timetable, currentNodeId, routeCache, onNavigate
}) => {
    const [alert, setAlert]   = useState<{ entry: TimetableEntry; minutesLeft: number; walkMins: number } | null>(null);
    const [dismissed, setDismissed] = useState<string | null>(null);

    useEffect(() => {
        if (!timetable.length) return;

        const check = () => {
            const now = new Date();
            const nowMins = now.getHours() * 60 + now.getMinutes();

            for (const entry of timetable) {
                if (entry.node_id === dismissed) continue;
                const [h, m] = entry.time.split(':').map(Number);
                const classMins = h * 60 + m;
                const diffMins = classMins - nowMins;

                // Alert if class is 5–20 minutes away
                if (diffMins >= 0 && diffMins <= 20) {
                    const route = routeCache[entry.node_id];
                    const walkSecs = route?.distance ? route.distance / WALK_SPEED_MPS : null;
                    const walkMins = walkSecs ? Math.ceil(walkSecs / 60) : 3;

                    // Only alert if you need to leave soon
                    if (diffMins <= walkMins + 2) {
                        setAlert({ entry, minutesLeft: diffMins, walkMins });
                        return;
                    }
                }
            }
        };

        check();
        const interval = setInterval(check, 30000); // recheck every 30s
        return () => clearInterval(interval);
    }, [timetable, dismissed, routeCache]);

    if (!alert) return null;

    const isLate = alert.minutesLeft <= alert.walkMins;

    return (
        <div className={`mx-4 rounded-xl border shadow-lg overflow-hidden ${
            isLate ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
        }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2 ${
                isLate ? 'bg-red-500' : 'bg-amber-500'
            }`}>
                <div className="flex items-center gap-2 text-white">
                    <Bell size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                        {isLate ? 'You are running late!' : 'Time to leave!'}
                    </span>
                </div>
                <button onClick={() => { setDismissed(alert.entry.node_id); setAlert(null); }}>
                    <X size={14} className="text-white/80 hover:text-white" />
                </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold text-slate-900">{alert.entry.subject}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-slate-600">
                                <Clock size={11} /> {alert.entry.time}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-600">
                                <MapPin size={11} /> {alert.entry.room}
                            </span>
                        </div>
                        <p className={`text-xs mt-1.5 font-semibold ${isLate ? 'text-red-600' : 'text-amber-700'}`}>
                            {isLate
                                ? `Hurry! Class starts in ${alert.minutesLeft}m, walk takes ~${alert.walkMins}m`
                                : `Class in ${alert.minutesLeft} min · ~${alert.walkMins} min walk`}
                        </p>
                    </div>
                    <button
                        onClick={() => { onNavigate(alert!.entry.node_id, alert!.entry.room); setAlert(null); }}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold ${
                            isLate ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
                        } transition-colors`}
                    >
                        <Navigation size={13} />
                        Go Now
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Demo alert for hackathon (simulates a class in 4 mins) ─── */
export const DemoProactiveAlert: React.FC<{ onNavigate: (id: string, name: string) => void }> = ({ onNavigate }) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="mx-4 rounded-xl border border-amber-300 bg-amber-50 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-amber-500">
                <div className="flex items-center gap-2 text-white">
                    <Bell size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">Time to leave!</span>
                </div>
                <button onClick={() => setVisible(false)}>
                    <X size={14} className="text-white/80 hover:text-white" />
                </button>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900">DBMS Lecture</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-600"><Clock size={11} /> 10:00 AM</span>
                        <span className="flex items-center gap-1 text-xs text-slate-600"><MapPin size={11} /> Room 204</span>
                    </div>
                    <p className="text-xs mt-1.5 font-semibold text-amber-700">
                        Class in 4 min · ~3 min walk
                    </p>
                </div>
                <button
                    onClick={() => { onNavigate('room_204', 'Room 204'); setVisible(false); }}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                >
                    <Navigation size={13} /> Go Now
                </button>
            </div>
        </div>
    );
};
