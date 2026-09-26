import React from 'react';
import { Link } from 'react-router-dom';
import {
    Map, Library, TrendingUp, Users, BookOpen,
    ArrowRight, CheckCircle, Clock, AlertTriangle,
    Building2, BarChart2
} from 'lucide-react';
import { libraryBooks, borrowRecords } from '../data/libraryData';

const StatCard: React.FC<{
    label: string; value: string; sub: string; color: string; icon: React.ReactNode;
}> = ({ label, value, sub, color, icon }) => (
    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
        <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{label}</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{sub}</p>
    </div>
);

export const AdminDashboard: React.FC = () => {
    const totalBooks = libraryBooks.length;
    const availableBooks = libraryBooks.filter(b => b.availableCopies > 0).length;
    const overdueRecords = borrowRecords.filter(r => r.status === 'overdue').length;
    const activeRecords = borrowRecords.filter(r => r.status === 'active').length;

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Campus 360 — Administrative Overview</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">Last synced</p>
                    <p className="text-sm font-bold text-slate-700">Just now</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Rooms Mapped" value="40" sub="4 floors · Block A" color="bg-blue-100" icon={<Building2 size={18} className="text-blue-600" />} />
                <StatCard label="Books in Library" value={String(totalBooks)} sub={`${availableBooks} titles available`} color="bg-emerald-100" icon={<BookOpen size={18} className="text-emerald-600" />} />
                <StatCard label="Active Borrows" value={String(activeRecords)} sub="Currently issued" color="bg-amber-100" icon={<Clock size={18} className="text-amber-600" />} />
                <StatCard label="Overdue Books" value={String(overdueRecords)} sub="Needs immediate attention" color="bg-red-100" icon={<AlertTriangle size={18} className="text-red-600" />} />
            </div>

            {/* Two-column quick access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Campus Management */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Map size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900">Campus Management</h3>
                            <p className="text-xs text-slate-400">Floor plans, rooms, navigation graph</p>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        {['Upload building photos', 'Configure rooms & labs', 'Set accessible routes', 'Manage timetable'].map(task => (
                            <div key={task} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />
                                {task}
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/campus" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors w-full">
                        Manage Campus <ArrowRight size={15} />
                    </Link>
                </div>

                {/* Library Management */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Library size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900">Library Management</h3>
                            <p className="text-xs text-slate-400">Books, circulation, shelf mapping</p>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        {['Add books via ISBN scan', 'Assign to rack & shelf', 'Issue & return books', 'Track overdue & fines'].map(task => (
                            <div key={task} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                                {task}
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/library" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors w-full">
                        Manage Library <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Recent Borrow Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900">Recent Circulation Activity</h3>
                    <Link to="/admin/library" className="text-xs text-blue-600 font-bold hover:underline">View All →</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {borrowRecords.map(record => (
                        <div key={record.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-black flex-shrink-0">
                                    {record.studentName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{record.studentName} <span className="text-slate-400 font-medium text-xs">({record.rollNo})</span></p>
                                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{record.bookTitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <p className="text-xs text-slate-400">Due: {record.dueDate}</p>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                    record.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                    record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-500'}`}>
                                    {record.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
