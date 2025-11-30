'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Plus } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface Book {
    _id: string;
    title: string;
    category: string;
    views: number;
    downloads: number;
}

export default function AdminDashboard() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin');
            return;
        }
        fetchBooks();
    }, [router]);

    const fetchBooks = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const { data } = await axios.get(`${apiUrl}/api/books`);
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
        }
    };

    const deleteBook = async (id: string) => {
        if (!confirm('Haqiqatan ham ushbu kitobni o\'chirmoqchimisiz?')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${apiUrl}/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Kitobni o\'chirishda xatolik yuz berdi');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex justify-center items-center text-[#0056b3]">
                    Yuklanmoqda...
                </div>
            </div>
        );
    }

    const totalViews = books.reduce((acc, book) => acc + book.views, 0);
    const totalDownloads = books.reduce((acc, book) => acc + book.downloads, 0);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0056b3]">Boshqaruv Paneli</h1>
                        <p className="text-gray-500 mt-2">Kitoblarni boshqarish va ko'rish</p>
                    </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Jami Kitoblar</h3>
                        <p className="text-4xl font-bold text-[#0056b3] mt-2">{books.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Jami Ko'rishlar</h3>
                        <p className="text-4xl font-bold text-[#0056b3] mt-2">{totalViews}</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Jami Yuklab Olishlar</h3>
                        <p className="text-4xl font-bold text-[#0056b3] mt-2">{totalDownloads}</p>
                    </div>
                </div>

                {/* Books Management */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Kitoblar Boshqaruvi</h2>
                        <button
                            onClick={() => router.push('/admin/dashboard/create')}
                            className="flex items-center px-4 py-2 bg-[#0056b3] text-white rounded-lg hover:bg-[#004494] transition-colors shadow-lg shadow-[#0056b3]/30"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Kitob Qo'shish
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sarlavha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoriya</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ko'rishlar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yuklab Olishlar</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {books.map((book) => (
                                    <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.views}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.downloads}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => router.push(`/admin/dashboard/edit/${book._id}`)}
                                                className="text-[#0056b3] hover:text-[#004494] mr-4 transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteBook(book._id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
