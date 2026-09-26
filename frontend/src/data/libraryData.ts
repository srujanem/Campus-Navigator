export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    category: string;
    edition: string;
    totalCopies: number;
    availableCopies: number;
    rack: string;
    shelf: string;
    navNodeId: string;
    coverColor: string;
    dueDate?: string;
}

export const libraryBooks: Book[] = [
    {
        id: 'b001', isbn: '978-0-13-468599-1',
        title: 'Operating System Concepts', author: 'Abraham Silberschatz',
        category: 'Computer Science', edition: '10th Edition',
        totalCopies: 5, availableCopies: 3,
        rack: 'Rack-1', shelf: 'Shelf-A (Top)', navNodeId: 'room_101',
        coverColor: '#1d4ed8',
    },
    {
        id: 'b002', isbn: '978-0-13-235088-4',
        title: 'Introduction to Algorithms', author: 'Thomas H. Cormen',
        category: 'Computer Science', edition: '3rd Edition',
        totalCopies: 4, availableCopies: 1,
        rack: 'Rack-1', shelf: 'Shelf-B (Middle)', navNodeId: 'room_101',
        coverColor: '#065f46', dueDate: 'Oct 5, 2026',
    },
    {
        id: 'b003', isbn: '978-0-13-600948-6',
        title: 'Computer Networks', author: 'Andrew S. Tanenbaum',
        category: 'Computer Science', edition: '5th Edition',
        totalCopies: 6, availableCopies: 4,
        rack: 'Rack-2', shelf: 'Shelf-A (Top)', navNodeId: 'room_102',
        coverColor: '#7c3aed',
    },
    {
        id: 'b004', isbn: '978-0-07-338092-1',
        title: 'Database System Concepts', author: 'Avi Silberschatz',
        category: 'Computer Science', edition: '7th Edition',
        totalCopies: 5, availableCopies: 0,
        rack: 'Rack-2', shelf: 'Shelf-B (Middle)', navNodeId: 'room_102',
        coverColor: '#b91c1c', dueDate: 'Oct 10, 2026',
    },
    {
        id: 'b005', isbn: '978-0-13-359162-0',
        title: 'Engineering Mathematics', author: 'B.S. Grewal',
        category: 'Mathematics', edition: '44th Edition',
        totalCopies: 8, availableCopies: 6,
        rack: 'Rack-3', shelf: 'Shelf-A (Top)', navNodeId: 'room_103',
        coverColor: '#c2410c',
    },
    {
        id: 'b006', isbn: '978-0-13-984084-5',
        title: 'Signals and Systems', author: 'Alan V. Oppenheim',
        category: 'Electronics', edition: '2nd Edition',
        totalCopies: 3, availableCopies: 2,
        rack: 'Rack-3', shelf: 'Shelf-B (Middle)', navNodeId: 'room_103',
        coverColor: '#0f766e',
    },
    {
        id: 'b007', isbn: '978-0-07-010401-5',
        title: 'Machine Learning', author: 'Tom Mitchell',
        category: 'Artificial Intelligence', edition: '1st Edition',
        totalCopies: 4, availableCopies: 3,
        rack: 'Rack-4', shelf: 'Shelf-A (Top)', navNodeId: 'room_104',
        coverColor: '#7e22ce',
    },
    {
        id: 'b008', isbn: '978-0-13-110362-7',
        title: 'The C Programming Language', author: 'Brian W. Kernighan',
        category: 'Computer Science', edition: '2nd Edition',
        totalCopies: 10, availableCopies: 7,
        rack: 'Rack-4', shelf: 'Shelf-C (Bottom)', navNodeId: 'room_104',
        coverColor: '#1e40af',
    },
];

export interface BorrowRecord {
    id: string;
    studentName: string;
    rollNo: string;
    bookTitle: string;
    issuedDate: string;
    dueDate: string;
    status: 'active' | 'overdue' | 'returned';
}

export const borrowRecords: BorrowRecord[] = [
    { id: 'r001', studentName: 'Arjun Reddy', rollNo: '21CS001', bookTitle: 'Introduction to Algorithms', issuedDate: 'Sep 15, 2026', dueDate: 'Oct 5, 2026', status: 'active' },
    { id: 'r002', studentName: 'Priya Sharma', rollNo: '21CS042', bookTitle: 'Database System Concepts', issuedDate: 'Sep 10, 2026', dueDate: 'Sep 30, 2026', status: 'overdue' },
    { id: 'r003', studentName: 'Rohit Kumar', rollNo: '21EC015', bookTitle: 'Computer Networks', issuedDate: 'Sep 20, 2026', dueDate: 'Oct 10, 2026', status: 'active' },
    { id: 'r004', studentName: 'Sneha Patel', rollNo: '21ME008', bookTitle: 'Engineering Mathematics', issuedDate: 'Sep 1, 2026', dueDate: 'Sep 21, 2026', status: 'returned' },
];
