'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, Edit, Plus, BookOpen, Eye, Download, 
    TrendingUp, AlertCircle, RefreshCw, Search,
    FileText, Calendar, BarChart3, Loader2,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface Book {
    _id: string;
    title: string;
    category: string;
    views: number;
    downloads: number;
    createdAt?: string;
    image?: string;
}

interface ErrorLog {
    id: string;
    timestamp: Date;
    type: 'error' | 'warning' | 'info';
    message: string;
    details?: any;
}

export default function AdminDashboard() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [allBooksForStats, setAllBooksForStats] = useState<Book[]>([]);
    const itemsPerPage = 10;
    const router = useRouter();

    // Error logging function
    const logError = (type: 'error' | 'warning' | 'info', message: string, details?: any) => {
        const log: ErrorLog = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type,
            message,
            details,
        };
        setErrorLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
        
        // Console logging with details
        console.group(`[${type.toUpperCase()}] ${new Date().toLocaleTimeString()}`);
        console.log('Message:', message);
        if (details) {
            console.log('Details:', details);
            if (details.response) {
                console.log('Response Status:', details.response.status);
                console.log('Response Data:', details.response.data);
            }
            if (details.request) {
                console.log('Request:', details.request);
            }
        }
        console.groupEnd();
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            logError('warning', 'No authentication token found, redirecting to login');
            router.push('/admin');
            return;
        }
        fetchBooks();
    }, [router]);

    useEffect(() => {
        fetchBooks();
    }, [currentPage, searchQuery]);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            logError('info', 'Fetching books from API', { url: `${apiUrl}/api/books` });
            
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
            });
            
            if (searchQuery.trim()) {
                params.append('search', searchQuery.trim());
            }
            
            const { data } = await axios.get(`${apiUrl}/api/books?${params.toString()}`, {
                timeout: 10000,
            });
            
            if (data.pagination) {
                const booksData = data.books || [];
                logError('info', `Successfully fetched ${booksData.length} books (page ${currentPage})`);
                setBooks(booksData);
                setFilteredBooks(booksData);
                setPagination(data.pagination);
            } else {
                const booksData = Array.isArray(data) ? data : (data.books || []);
                logError('info', `Successfully fetched ${booksData.length} books`);
                setBooks(booksData);
                setFilteredBooks(booksData);
                setPagination(null);
            }
            setLoading(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Kitoblarni yuklashda xatolik yuz berdi';
            
            logError('error', 'Failed to fetch books', {
                error: errorMessage,
                response: error.response,
                request: error.request,
                code: error.code,
            });
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteBook = async (id: string, title: string) => {
        if (!confirm(`Haqiqatan ham "${title}" kitobni o'chirmoqchimisiz?`)) {
            logError('info', 'Book deletion cancelled by user', { bookId: id, title });
            return;
        }
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const token = localStorage.getItem('adminToken');
            
            logError('info', 'Deleting book', { bookId: id, title });
            
            await axios.delete(`${apiUrl}/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            
            logError('info', 'Book deleted successfully', { bookId: id, title });
            await fetchBooks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Kitobni o\'chirishda xatolik yuz berdi';
            
            logError('error', 'Failed to delete book', {
                bookId: id,
                title,
                error: errorMessage,
                response: error.response,
            });
            
            alert(`Xatolik: ${errorMessage}`);
        }
    };

    // Fetch all books for statistics
    useEffect(() => {
        const fetchAllForStats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
                const { data } = await axios.get(`${apiUrl}/api/books?limit=1000`);
                const booksData = Array.isArray(data) ? data : (data.books || []);
                setAllBooksForStats(booksData);
            } catch (error) {
                console.error('Error fetching all books for stats:', error);
            }
        };
        fetchAllForStats();
    }, []);

    const totalViews = allBooksForStats.reduce((acc, book) => acc + book.views, 0);
    const totalDownloads = allBooksForStats.reduce((acc, book) => acc + book.downloads, 0);
    const avgViews = allBooksForStats.length > 0 ? Math.round(totalViews / allBooksForStats.length) : 0;
    const avgDownloads = allBooksForStats.length > 0 ? Math.round(totalDownloads / allBooksForStats.length) : 0;
    const categories = [...new Set(allBooksForStats.map(book => book.category))].length;
    const totalBooks = allBooksForStats.length;

    // Top performing books
    const topBooks = [...books]
        .sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads))
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <AdminSidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                    >
                        <Loader2 className="w-12 h-12 text-[#0056b3] animate-spin mx-auto" />
                        <p className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />
            <div className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Boshqaruv Paneli</h1>
                            <p className="text-gray-500 mt-1">Kitoblarni boshqarish va monitoring</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Yangilash
                            </button>
                            <button
                                onClick={() => router.push('/admin/dashboard/create')}
                                className="px-4 py-2 bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Yangi Kitob
                            </button>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-800 font-medium">Xatolik yuz berdi</p>
                                    <p className="text-red-600 text-sm mt-1">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <BookOpen className="w-6 h-6 text-[#0056b3]" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Jami Kitoblar</h3>
                            <p className="text-3xl font-bold text-gray-900">{totalBooks || books.length}</p>
                            <p className="text-xs text-gray-400 mt-2">{categories} ta kategoriya</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <Eye className="w-6 h-6 text-purple-600" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Jami Ko'rishlar</h3>
                            <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-2">O'rtacha: {avgViews.toLocaleString()}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <Download className="w-6 h-6 text-green-600" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Jami Yuklab Olishlar</h3>
                            <p className="text-3xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-2">O'rtacha: {avgDownloads.toLocaleString()}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <BarChart3 className="w-6 h-6 text-orange-600" />
                                </div>
                                <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Faollik</h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {books.length > 0 ? Math.round((totalDownloads / totalViews) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Yuklab olish/ko'rish nisbati</p>
                        </motion.div>
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kitob nomi yoki kategoriya bo'yicha qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3] transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Books Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Kitoblar Ro'yxati</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {filteredBooks.length} ta kitob topildi
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Kitob
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Kategoriya
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Ko'rishlar
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Yuklab Olishlar
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Amallar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <BookOpen className="w-12 h-12 text-gray-300" />
                                                    <p className="text-gray-500 font-medium">Kitoblar topilmadi</p>
                                                    <p className="text-sm text-gray-400">
                                                        {searchQuery ? 'Qidiruv natijasi bo\'sh' : 'Hali kitob qo\'shilmagan'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBooks.map((book, index) => (
                                            <motion.tr
                                                key={book._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#0056b3] to-[#00a8ff] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                            {book.title.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{book.title}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {book.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700 font-medium">
                                                            {book.views.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Download className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700 font-medium">
                                                            {book.downloads.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => router.push(`/admin/dashboard/edit/${book._id}`)}
                                                            className="p-2 text-[#0056b3] hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Tahrirlash"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteBook(book._id, book.title)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="O'chirish"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between px-6 py-4 border-t border-gray-100"
                            >
                                <div className="text-sm text-gray-600">
                                    {pagination.totalItems} ta kitobdan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalItems)} tasi ko'rsatilmoqda
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(pagination.totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (
                                                page === 1 ||
                                                page === pagination.totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                                            currentPage === page
                                                                ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white shadow-lg'
                                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="px-2 text-gray-400">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Error Logs Section (Collapsible) */}
                    {errorLogs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <details className="group">
                                <summary className="p-6 border-b border-gray-100 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Xatolik Log'lari ({errorLogs.length})
                                        </h3>
                                    </div>
                                    <span className="text-sm text-gray-500 group-open:rotate-180 transition-transform">
                                        ▼
                                    </span>
                                </summary>
                                <div className="p-6 max-h-96 overflow-y-auto">
                                    <div className="space-y-3">
                                        {errorLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className={`p-4 rounded-lg border-l-4 ${
                                                    log.type === 'error'
                                                        ? 'bg-red-50 border-red-500'
                                                        : log.type === 'warning'
                                                        ? 'bg-yellow-50 border-yellow-500'
                                                        : 'bg-blue-50 border-blue-500'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-semibold uppercase ${
                                                                log.type === 'error'
                                                                    ? 'text-red-700'
                                                                    : log.type === 'warning'
                                                                    ? 'text-yellow-700'
                                                                    : 'text-blue-700'
                                                            }`}>
                                                                {log.type}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {log.timestamp.toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm ${
                                                            log.type === 'error'
                                                                ? 'text-red-800'
                                                                : log.type === 'warning'
                                                                ? 'text-yellow-800'
                                                                : 'text-blue-800'
                                                        }`}>
                                                            {log.message}
                                                        </p>
                                                        {log.details && (
                                                            <details className="mt-2">
                                                                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                                                    Batafsil ma'lumot
                                                                </summary>
                                                                <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                                                                    {JSON.stringify(log.details, null, 2)}
                                                                </pre>
                                                            </details>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
