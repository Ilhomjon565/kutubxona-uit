'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, User, BookOpen, LogOut, ShieldCheck, PlusCircle, Settings } from 'lucide-react';
import Link from 'next/link';

interface SidebarItem {
    name: string;
    icon: React.ReactNode;
    path: string;
}

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems: SidebarItem[] = [
        {
            name: 'Asosiy panel',
            icon: <LayoutDashboard className="w-5 h-5" />,
            path: '/admin/dashboard',
        },
        {
            name: 'Kitob qo\'shish',
            icon: <PlusCircle className="w-5 h-5" />,
            path: '/admin/dashboard/create',
        },
        {
            name: 'Analizlar',
            icon: <BarChart3 className="w-5 h-5" />,
            path: '/admin/analytics',
        },
        {
            name: 'Profil',
            icon: <User className="w-5 h-5" />,
            path: '/admin/profile',
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin');
    };

    return (
        <div className="w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col sticky top-0 shadow-sm">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0056b3] to-[#00a8ff] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">Admin</h1>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#0056b3]">Kutubxona</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || 
                        (item.path === '/admin/dashboard' && pathname === '/admin/dashboard');
                    
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                                isActive
                                    ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Xavfsizlik</p>
                        <p className="text-[10px] text-gray-500">Faol: SSL & Rate Limit</p>
                    </div>
                </div>
                
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Chiqish</span>
                </button>
            </div>
        </div>
    );
}


