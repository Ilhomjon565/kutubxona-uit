'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, 
    Search, 
    RefreshCw, 
    Trash2, 
    Monitor, 
    Globe, 
    Calendar,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';

export default function BlockedIpsPage() {
    const [blockedIps, setBlockedIps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

    const fetchBlockedIps = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${apiUrl}/auth/blocked-ips?ip=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlockedIps(data);
        } catch (error) {
            console.error('Error fetching blocked IPs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBlockedIps();
    }, []);

    const handleUnblock = async (id: string) => {
        if (!confirm('Haqiqatan ham ushbu IP manzilni blokdan chiqarmoqchimisiz?')) return;
        
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${apiUrl}/auth/blocked-ips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlockedIps(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            alert('Blokdan chiqarishda xatolik yuz berdi');
        }
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#0f172a] flex items-center gap-3">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                        Bloklanganlar
                    </h1>
                    <p className="text-gray-500 font-medium">Xavfsizlik tizimi tomonidan bloklangan IP va qurilmalar</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="IP bo'yicha qidirish..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchBlockedIps()}
                            className="pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-bold w-64"
                        />
                    </div>
                    <button 
                        onClick={() => fetchBlockedIps(true)}
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
                        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
                        <p className="text-gray-400 font-bold">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : blockedIps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Bloklanganlar yo'q</h3>
                        <p className="text-gray-500 font-medium">Tizimda hozircha bloklangan IP manzillar mavjud emas.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">IP Manzil</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qurilma</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sabab</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {blockedIps.map((item, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={item._id} 
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-gray-900">{item.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Monitor className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600 line-clamp-1 max-w-[200px]" title={item.deviceInfo}>
                                                    {item.deviceInfo}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                                                <AlertCircle className="w-3 h-3" />
                                                {item.reason || '2FA rad etildi'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleUnblock(item._id)}
                                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-600 hover:border-green-100 hover:bg-green-50 transition-all shadow-sm"
                                                title="Blokdan chiqarish"
                                            >
                                                <RefreshCw className="w-4 h-4" />
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