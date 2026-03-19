'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Users, 
    Search, 
    RefreshCw, 
    Unlink, 
    User, 
    MessageSquare, 
    IdCard,
    Loader2,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

export default function Student2FAManagementPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

    const fetchStudents = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${apiUrl}/auth/student-2fa?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(data);
        } catch (error) {
            console.error('Error fetching 2FA students:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDisconnect = async (id: string, name: string) => {
        if (!confirm(`Haqiqatan ham ${name} uchun 2FA himoyasini o'chirib, Telegram hisobidan uzmoqchimisiz?`)) return;
        
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${apiUrl}/auth/student-2fa/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            alert('O\'chirishda xatolik yuz berdi');
        }
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#0f172a] flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-[#0056b3]" />
                        2FA Boshqaruvi
                    </h1>
                    <p className="text-gray-500 font-medium">Talabalar va ularga bog'langan Telegram hisoblar</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Ism, ID yoki Telegram..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                            className="pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3] transition-all text-sm font-bold w-64"
                        />
                    </div>
                    <button 
                        onClick={() => fetchStudents(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-[#0056b3] animate-spin" />
                        <p className="text-gray-400 font-bold">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                            <Users className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Faol 2FA foydalanuvchilari yo'q</h3>
                        <p className="text-gray-500 font-medium">Hozircha hech qaysi talaba 2FA ni yoqmagan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Talaba</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">HEMIS Login</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Telegram Hisob</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((item, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={item._id} 
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                    {item.fullName.charAt(0)}
                                                </div>
                                                <span className="font-black text-gray-900">{item.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <IdCard className="w-4 h-4 text-gray-400" />
                                                <span className="font-bold text-gray-600">{item.studentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img 
                                                        src={item.telegramPhotoUrl || `https://ui-avatars.com/api/?name=${item.telegramUsername || 'TG'}&background=0088cc&color=fff`} 
                                                        alt="TG"
                                                        className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                                                        onError={(e: any) => e.target.src = `https://ui-avatars.com/api/?name=${item.telegramUsername || 'TG'}&background=0088cc&color=fff`}
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0088cc] rounded-full flex items-center justify-center border-2 border-white">
                                                        <MessageSquare className="w-2 h-2 text-white fill-current" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">@{item.telegramUsername || 'username_yoq'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">ID: {item.telegramId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleDisconnect(item._id, item.fullName)}
                                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
                                                title="Telegramni uzish"
                                            >
                                                <Unlink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}