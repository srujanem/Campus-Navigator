import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, BookOpen, MapPin, Navigation, Filter,
    CheckCircle, Clock, AlertCircle, Star, ArrowRight,
    ChevronDown, Library, ScanLine
} from 'lucide-react';
import { libraryBooks, Book } from '../data/libraryData';

const CATEGORIES = ['All', 'Computer Science', 'Mathematics', 'Electronics', 'Artificial Intelligence'];

const AvailabilityBadge: React.FC<{ copies: number; dueDate?: string }> = ({ copies, dueDate }) => {
    if (copies === 0) return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            <AlertCircle size={10} /> Fully Issued {dueDate ? `· Due ${dueDate}` : ''}
        </span>
    );
    if (copies === 1) return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            <Clock size={10} /> Last Copy — Reserve Now
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle size={10} /> Available ({copies} copies)
        </span>
    );
};

const BookCard: React.FC<{ book: Book; onNavigate: (book: Book) => void }> = ({ book, onNavigate }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex">
        {/* Color Spine */}
        <div className="w-2 flex-shrink-0" style={{ backgroundColor: book.coverColor }} />

        {/* Book Cover Thumbnail */}
        <div className="w-20 flex-shrink-0 flex items-center justify-center p-3" style={{ backgroundColor: book.coverColor + '20' }}>
            <div className="w-12 h-16 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: book.coverColor }}>
                <BookOpen size={18} className="text-white opacity-80" />
            </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-slate-900 text-sm leading-tight line-clamp-2">{book.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-1">{book.author}</p>
            <p className="text-[10px] text-slate-400 mb-2">{book.edition} · {book.category}</p>
            <AvailabilityBadge copies={book.availableCopies} dueDate={book.dueDate} />

            <div className="flex items-center gap-1.5 mt-3">
                <MapPin size={10} className="text-slate-400 flex-shrink-0" />
                <p className="text-[10px] text-slate-400">{book.rack} · {book.shelf}</p>
            </div>
        </div>

        {/* Actions */}
        <div className="p-3 flex flex-col items-end justify-between flex-shrink-0">
            {book.availableCopies > 0 && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors">
                    Reserve
                </button>
            )}
            <button
                onClick={() => onNavigate(book)}
                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors mt-2">
                <Navigation size={12} /> Walk to Shelf
            </button>
        </div>
    </div>
);

export const StudentLibrary: React.FC = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [navigateTo, setNavigateTo] = useState<Book | null>(null);

    const filtered = libraryBooks.filter(b => {
        const matchesQuery = !query || [b.title, b.author, b.isbn, b.category]
            .some(f => f.toLowerCase().includes(query.toLowerCase()));
        const matchesCat = category === 'All' || b.category === category;
        return matchesQuery && matchesCat;
    });

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Campus Library</h2>
                        <p className="text-xs text-slate-400 font-medium">{libraryBooks.length} titles · {libraryBooks.filter(b => b.availableCopies > 0).length} available right now</p>
                    </div>

                    <div className="flex items-center gap-3 flex-1 max-w-xl">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search by title, author, ISBN, or subject…"
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Navigate to Shelf Banner */}
                {navigateTo && (
                    <div className="m-4 bg-blue-600 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Navigation size={20} className="text-white flex-shrink-0" />
                            <div>
                                <p className="text-white font-black text-sm">Navigating to: {navigateTo.rack}, {navigateTo.shelf}</p>
                                <p className="text-blue-200 text-xs">"{navigateTo.title}" — Open the Navigator tab to see the route</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/student"
                                state={{ targetNode: navigateTo.navNodeId, targetName: `${navigateTo.rack} (${navigateTo.shelf})` }}
                                className="bg-white text-blue-600 font-black text-xs px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                                Open Map →
                            </Link>
                            <button onClick={() => setNavigateTo(null)} className="text-blue-200 hover:text-white text-xs">✕</button>
                        </div>
                    </div>
                )}

                {/* Availability Summary Bar */}
                <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
                    {[
                        { label: 'Available', count: libraryBooks.filter(b => b.availableCopies > 1).length, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                        { label: 'Last Copy', count: libraryBooks.filter(b => b.availableCopies === 1).length, color: 'bg-amber-50 border-amber-200 text-amber-800' },
                        { label: 'Fully Issued', count: libraryBooks.filter(b => b.availableCopies === 0).length, color: 'bg-red-50 border-red-200 text-red-800' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                            <p className="text-2xl font-black">{s.count}</p>
                            <p className="text-xs font-bold">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Results */}
                <div className="p-4 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <Library size={40} className="mx-auto mb-3 text-slate-200" />
                            <p className="font-bold">No books found</p>
                            <p className="text-sm">Try a different search term or category</p>
                        </div>
                    ) : filtered.map(book => (
                        <BookCard key={book.id} book={book} onNavigate={setNavigateTo} />
                    ))}
                </div>
            </div>
        </div>
    );
};
