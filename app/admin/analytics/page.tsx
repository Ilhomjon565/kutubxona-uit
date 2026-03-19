'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    BookOpen, 
    Download, 
    TrendingUp,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${apiUrl}/auth/student-analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056b3]"></div>
        </div>
    );

    return (
        <div className="space-y-8 p-6 lg:p-10">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analizlar</h1>
                <p className="text-gray-500 font-medium">Kutubxona faoliyati tahlili</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Talabalar</p>
                        <h3 className="text-4xl font-black text-gray-900">{analytics?.totalStudents || 0}</h3>
                        <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Faol talabalar
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Users className="w-8 h-8" />
                    </div>
                </div>

                {/* Additional Stats can be added here */}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Faollik grafigi</h3>
                            <p className="text-sm text-gray-500">Oxirgi 7 kunlik tahlil</p>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics?.chartData || []}>
                            <defs>
                                <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0056b3" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0056b3" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="_id" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="logins" 
                                stroke="#0056b3" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorLogins)" 
                                name="Kirishlar"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="downloads" 
                                stroke="#10b981" 
                                strokeWidth={4}
                                fillOpacity={0} 
                                name="Yuklashlar"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}


