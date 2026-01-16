'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface Book {
    _id: string;
    title: string;
    category: string;
    views: number;
    downloads: number;
}

const COLORS = ['#0056b3', '#00a8ff', '#004494', '#0088cc', '#0066aa'];

export default function AnalyticsPage() {
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
            const { data } = await axios.get(`${apiUrl}/api/books?limit=1000`);
            // Handle pagination response
            const booksData = Array.isArray(data) ? data : (data.books || []);
            setBooks(booksData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
        }
    };

    // Prepare data for charts
    const categoryData = () => {
        if (!Array.isArray(books) || books.length === 0) {
            return [];
        }
        
        const categoryMap: { [key: string]: { views: number; downloads: number; count: number } } = {};
        
        books.forEach((book) => {
            if (!book || !book.category) return;
            if (!categoryMap[book.category]) {
                categoryMap[book.category] = { views: 0, downloads: 0, count: 0 };
            }
            categoryMap[book.category].views += book.views || 0;
            categoryMap[book.category].downloads += book.downloads || 0;
            categoryMap[book.category].count += 1;
        });

        return Object.entries(categoryMap).map(([category, data]) => ({
            name: category,
            views: data.views,
            downloads: data.downloads,
            count: data.count,
        }));
    };

    const topBooksData = () => {
        if (!Array.isArray(books) || books.length === 0) {
            return [];
        }
        return [...books]
            .filter(book => book && book.title)
            .sort((a, b) => ((b.views || 0) + (b.downloads || 0)) - ((a.views || 0) + (a.downloads || 0)))
            .slice(0, 10)
            .map((book) => ({
                name: book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title,
                views: book.views || 0,
                downloads: book.downloads || 0,
            }));
    };

    const pieChartData = () => {
        return categoryData().map((item) => ({
            name: item.name,
            value: item.count,
        }));
    };

    const totalViews = Array.isArray(books) ? books.reduce((acc, book) => acc + (book.views || 0), 0) : 0;
    const totalDownloads = Array.isArray(books) ? books.reduce((acc, book) => acc + (book.downloads || 0), 0) : 0;
    const totalBooks = Array.isArray(books) ? books.length : 0;

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

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0056b3]">Analizlar</h1>
                        <p className="text-gray-500 mt-2">Kitoblar statistikasi va tahlillari</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Jami Kitoblar</h3>
                            <p className="text-4xl font-bold text-[#0056b3] mt-2">{totalBooks}</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Jami Ko'rishlar</h3>
                            <p className="text-4xl font-bold text-[#0056b3] mt-2">{totalViews.toLocaleString()}</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Jami Yuklab Olishlar</h3>
                            <p className="text-4xl font-bold text-[#0056b3] mt-2">{totalDownloads.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Category Bar Chart */}
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Kategoriyalar bo'yicha Ko'rishlar va Yuklab Olishlar
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#0056b3" name="Ko'rishlar" />
                                    <Bar dataKey="downloads" fill="#00a8ff" name="Yuklab Olishlar" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Category Pie Chart */}
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Kategoriyalar bo'yicha Kitoblar Taqsimoti
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Books Line Chart */}
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Eng Mashhur 10 Kitob
                        </h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={topBooksData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#0056b3"
                                    strokeWidth={2}
                                    name="Ko'rishlar"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="downloads"
                                    stroke="#00a8ff"
                                    strokeWidth={2}
                                    name="Yuklab Olishlar"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}


