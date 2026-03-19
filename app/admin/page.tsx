'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    // Prevent indexing
    useEffect(() => {
        // Add noindex meta tag
        const metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex, nofollow';
        document.head.appendChild(metaRobots);

        return () => {
            document.head.removeChild(metaRobots);
        };
    }, []);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isWaiting2FA, setIsWaiting2FA] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const router = useRouter();

    // Polling for 2FA status
    useEffect(() => {
        let interval: any;
        if (isWaiting2FA && requestId) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';
            interval = setInterval(async () => {
                try {
                    const { data } = await axios.get(`${apiUrl}/auth/check-status/${requestId}`);
                    
                    if (data.status === 'approved') {
                        clearInterval(interval);
                        localStorage.setItem('adminToken', data.token);
                        router.push('/admin/dashboard');
                    } else if (data.status === 'blocked') {
                        clearInterval(interval);
                        setIsWaiting2FA(false);
                        setRequestId(null);
                        setError('Sizning kirish so\'rovingiz rad etildi!');
                    }
                } catch (error) {
                    console.error('Check status error:', error);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isWaiting2FA, requestId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';
            const deviceInfo = typeof window !== 'undefined' ? `${window.navigator.platform} - ${window.navigator.userAgent.split(') ')[0]})` : 'Unknown';
            
            const loginData = {
                login,
                password,
                deviceInfo
            };

            console.log('Sending admin login request to:', `${apiUrl}/auth/login`);
            
            const { data } = await axios.post(
                `${apiUrl}/auth/login`,
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (data.two_factor) {
                setIsWaiting2FA(true);
                setRequestId(data.requestId);
                setError('');
            } else {
                localStorage.setItem('adminToken', data.token);
                router.push('/admin/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            
            if (err.response) {
                setError(err.response.data?.message || 'Kirishda xatolik yuz berdi');
            } else if (err.request) {
                setError('Serverga ulanib bo\'lmadi. Backend server ishlamoqdamimi?');
            } else {
                setError('Kirishda xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0056b3]/10 via-white to-[#00a8ff]/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#0056b3]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00a8ff]/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-[#0056b3]/10 p-8 space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center space-y-2"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-br from-[#0056b3] to-[#00a8ff] rounded-2xl shadow-lg shadow-[#0056b3]/30">
                                <LogIn className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#0f172a]">
                            {isWaiting2FA ? 'Tasdiqlash kutilmoqda' : 'Admin Kirish'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isWaiting2FA 
                                ? 'Kirish so\'rovi Telegram guruhga yuborildi. Iltimos, tasdiqlashni kuting.' 
                                : 'UIT Kutubxona boshqaruv paneliga kirish'}
                        </p>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                        >
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {/* Form or Waiting State */}
                    {isWaiting2FA ? (
                        <div className="flex flex-col items-center py-8 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#0056b3]/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                                    <Loader2 className="w-12 h-12 text-[#0056b3] animate-spin" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-[#0056b3] font-bold animate-pulse">Kutilmoqda...</p>
                                <button 
                                    onClick={() => { setIsWaiting2FA(false); setRequestId(null); }}
                                    className="text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Login
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3] text-gray-900 transition-all placeholder-gray-400"
                                        placeholder="Loginni kiriting"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Parol
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3] text-gray-900 transition-all placeholder-gray-400"
                                        placeholder="Parolni kiriting"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-3.5 font-bold text-white bg-gradient-to-r from-[#0056b3] to-[#00a8ff] rounded-xl hover:from-[#004494] hover:to-[#0088cc] transition-all shadow-lg shadow-[#0056b3]/30 hover:shadow-xl hover:shadow-[#0056b3]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Kirilmoqda...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        <span>Kirish</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
