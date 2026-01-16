'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, User, BookOpen, LogOut } from 'lucide-react';

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
            name: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            path: '/admin/dashboard',
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
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-[#0056b3]">UIT Kutubxona</h1>
                <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || 
                        (item.path === '/admin/dashboard' && pathname?.startsWith('/admin/dashboard'));
                    
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                isActive
                                    ? 'bg-[#0056b3] text-white shadow-lg shadow-[#0056b3]/30'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Chiqish</span>
                </button>
            </div>
        </div>
    );
}


