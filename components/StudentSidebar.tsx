'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  Library, 
  User, 
  LogOut, 
  ChevronRight, 
  Search,
  BookOpen,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

export default function StudentSidebar({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: SidebarItem[] = [
    {
      name: 'Kutubxona',
      icon: <Library className="w-5 h-5" />,
      path: '/',
    },
    {
      name: 'Profilim',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col sticky top-0 shadow-sm z-30">
      {/* Profile Header */}
      <div className="p-8 border-b border-gray-50 text-center space-y-4">
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <img 
            src={user.image || '/logo.png'} 
            alt={user.full_name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover relative z-10 mx-auto"
            onError={(e: any) => e.target.src = '/logo.png'}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{user.full_name}</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#0056b3] mt-1">
            {user.studentStatus?.name || 'Talaba'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
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

      {/* Quick Stats or Info */}
      <div className="p-6">
        <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 font-bold uppercase tracking-tighter">Guruh:</span>
            <span className="text-gray-900 font-black">{user.group?.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 font-bold uppercase tracking-tighter">GPA:</span>
            <span className="text-gray-900 font-black">{user.avg_gpa}</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center gap-3 px-5 py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
}
