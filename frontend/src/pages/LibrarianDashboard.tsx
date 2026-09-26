import React, { useState } from 'react';
import {
    BookOpen, Plus, Search, RotateCcw, Check,
    AlertTriangle, Package, ArrowLeft, ScanLine,
    Clock, Users, Trash2, Edit3, Library
} from 'lucide-react';
import { libraryBooks, borrowRecords, Book, BorrowRecord } from '../data/libraryData';

const ISBN_MOCK: Record<string, Partial<Book>> = {
    '978-0-13-110362-7': { title: 'The C Programming Language', author: 'Brian W. Kernighan', category: 'Computer Science', edition: '2nd Edition' },
    '978-0-13-468599-1': { title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Computer Science', edition: '10th Edition' },
    '978-1-4920-3435-4': { title: 'Deep Learning', author: 'Ian Goodfellow', category: 'Artificial Intelligence', edition: '1st Edition' },
    '978-0-13-228878-2': { title: 'Design Patterns', author: 'Gang of Four', category: 'Computer Science', edition: '1st Edition' },
};

const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string; count?: number }> = ({ active, onClick, label, count }) => (
    <button onClick={onClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
        {label}
        {count !== undefined && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
        )}
    </button>
);

const AddBookForm: React.FC = () => {
    const [isbn, setIsbn] = useState('');
    const [form, setForm] = useState<Partial<Book>>({});
    const [fetched, setFetched] = useState(false);
    const [rack, setRack] = useState('');
    const [shelf, setShelf] = useState('');
    const [copies, setCopies] = useState(1);
    const [saved, setSaved] = useState(false);

    const fetchISBN = () => {
        const found = ISBN_MOCK[isbn];
        if (found) {
            setForm(found);
            setFetched(true);
        } else {
            setForm({ title: 'Unknown Title', author: 'Unknown Author', category: 'General', edition: '1st Edition' });
            setFetched(true);
        }
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setIsbn(''); setForm({}); setFetched(false); setRack(''); setShelf(''); setCopies(1);
    };

    return (
        <div className="space-y-5">
            {saved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-800 text-sm font-bold">
                    <Check size={16} /> Book added to catalog successfully!
                </div>
            )}

            {/* Step 1: ISBN */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-black">1</span>
                    Enter or Scan ISBN
                </h3>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <ScanLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={isbn}
                            onChange={e => setIsbn(e.target.value)}
                            placeholder="e.g. 978-0-13-110362-7"
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 bg-slate-50"
                        />
                    </div>
                    <button
                        onClick={fetchISBN}
                        disabled={!isbn}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-40 transition-colors flex items-center gap-2">
                        <Search size={14} /> Auto-Fill
                    </button>
                </div>
                {!fetched && (
                    <p className="text-xs text-slate-400 mt-2">Try: <code className="bg-slate-100 px-1 rounded">978-0-13-110362-7</code> or <code className="bg-slate-100 px-1 rounded">978-1-4920-3435-4</code></p>
                )}
            </div>

            {/* Step 2: Book Details (auto-filled) */}
            {fetched && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-black">2</span>
                        Book Details <span className="text-emerald-600 text-xs font-bold ml-2">✓ Auto-filled from ISBN</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Title', key: 'title' },
                            { label: 'Author', key: 'author' },
                            { label: 'Category', key: 'category' },
                            { label: 'Edition', key: 'edition' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
                                <input
                                    value={(form as any)[f.key] || ''}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-emerald-50 focus:outline-none focus:border-emerald-400"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Number of Copies</label>
                        <input type="number" min={1} max={20} value={copies} onChange={e => setCopies(Number(e.target.value))}
                            className="w-24 mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" />
                    </div>
                </div>
            )}

            {/* Step 3: Shelf Location */}
            {fetched && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-black">3</span>
                        Assign Physical Location
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Rack Number</label>
                            <select value={rack} onChange={e => setRack(e.target.value)}
                                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-slate-50">
                                <option value="">Select Rack…</option>
                                {['Rack-1', 'Rack-2', 'Rack-3', 'Rack-4', 'Rack-5'].map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Shelf Tier</label>
                            <select value={shelf} onChange={e => setShelf(e.target.value)}
                                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-slate-50">
                                <option value="">Select Shelf…</option>
                                {['Shelf-A (Top)', 'Shelf-B (Middle)', 'Shelf-C (Bottom)'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!rack || !shelf}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Check size={16} /> Add Book to Catalog
                    </button>
                </div>
            )}
        </div>
    );
};

const CirculationPanel: React.FC = () => {
    const [records, setRecords] = useState<BorrowRecord[]>(borrowRecords);

    const markReturned = (id: string) => {
        setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'returned' as const } : r));
    };

    return (
        <div className="space-y-4">
            {/* Quick Issue Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-black text-slate-900 mb-4">Quick Issue / Return</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Student Roll No.</label>
                        <input placeholder="e.g. 21CS001" className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-slate-50" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Book Barcode / ISBN</label>
                        <input placeholder="Scan or type…" className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-slate-50" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Due Date</label>
                        <input type="date" className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-slate-50" />
                    </div>
                </div>
                <button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors">
                    Issue Book
                </button>
            </div>

            {/* Active Records */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900">All Circulation Records</h3>
                    <div className="flex gap-2">
                        {(['active', 'overdue', 'returned'] as const).map(s => (
                            <span key={s} className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                s === 'active' ? 'bg-blue-100 text-blue-700' :
                                s === 'overdue' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-500'}`}>
                                {records.filter(r => r.status === s).length} {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {records.map(record => (
                        <div key={record.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-black flex-shrink-0">
                                    {record.studentName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{record.studentName} <span className="text-xs text-slate-400 font-medium">({record.rollNo})</span></p>
                                    <p className="text-xs text-slate-500 truncate max-w-[220px]">{record.bookTitle}</p>
                                    <p className="text-[10px] text-slate-400">Issued: {record.issuedDate} · Due: {record.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                    record.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                    record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-500'}`}>
                                    {record.status === 'overdue' && '⚠ '}
                                    {record.status.toUpperCase()}
                                </span>
                                {record.status !== 'returned' && (
                                    <button onClick={() => markReturned(record.id)}
                                        className="text-[10px] font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2.5 py-1 rounded-lg transition-colors">
                                        Mark Returned
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CatalogView: React.FC = () => {
    const [query, setQuery] = useState('');
    const books = query
        ? libraryBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
        : libraryBooks;

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Search catalog…"
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 bg-slate-50" />
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {['Title', 'Author', 'Category', 'Total', 'Available', 'Location'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {books.map(book => (
                            <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-8 rounded-sm flex-shrink-0" style={{ backgroundColor: book.coverColor }} />
                                        <p className="font-bold text-slate-900 line-clamp-1 max-w-[150px]">{book.title}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{book.author}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{book.category}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-700 font-bold">{book.totalCopies}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-sm font-black ${book.availableCopies === 0 ? 'text-red-600' : book.availableCopies === 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {book.availableCopies}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500">{book.rack} · {book.shelf}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const LibrarianDashboard: React.FC = () => {
    const [tab, setTab] = useState<'catalog' | 'add' | 'circulation'>('catalog');

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Library size={20} className="text-emerald-600" /> Library Management
                        </h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{libraryBooks.length} books · {borrowRecords.filter(r => r.status === 'active').length} active borrows · {borrowRecords.filter(r => r.status === 'overdue').length} overdue</p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <TabBtn active={tab === 'catalog'} onClick={() => setTab('catalog')} label="📚 Book Catalog" count={libraryBooks.length} />
                        <TabBtn active={tab === 'add'} onClick={() => setTab('add')} label="➕ Add Book" />
                        <TabBtn active={tab === 'circulation'} onClick={() => setTab('circulation')} label="⟳ Circulation" count={borrowRecords.filter(r => r.status !== 'returned').length} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                {tab === 'catalog' && <CatalogView />}
                {tab === 'add' && <AddBookForm />}
                {tab === 'circulation' && <CirculationPanel />}
            </div>
        </div>
    );
};
