'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, User, LogIn, LogOut } from 'lucide-react';
import Logo from './Logo';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0f172a] border-b border-white/10 backdrop-blur-xl' 
        : 'glass-enhanced border-b border-gray-100/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-3 group magnetic">
            <div className="relative" style={{maxWidth: "60px"}}>
              <Logo 
                src="/headerlogo.png"
              />
            </div>
            <div className="flex flex-col border-l border-gray-200 pl-3 ml-1">
              <span className={`text-xl font-black leading-tight tracking-tight ${
                isScrolled ? 'text-white' : 'text-[#0f172a]'
              }`}>
                UIT
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                isScrolled ? 'text-white/80' : 'text-[#0056b3]'
              }`}>
                Kutubxona
                
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-all relative group ${
                isScrolled 
                  ? 'text-white hover:text-white/80' 
                  : 'text-gray-600 hover:text-[#0056b3]'
              }`}
            >
              Asosiy
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
                isScrolled ? 'bg-white' : 'bg-[#0056b3]'
              } group-hover:w-full`} />
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-all relative group ${
                isScrolled 
                  ? 'text-white hover:text-white/80' 
                  : 'text-gray-600 hover:text-[#0056b3]'
              }`}
            >
              Biz haqimizda
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
                isScrolled ? 'bg-white' : 'bg-[#0056b3]'
              } group-hover:w-full`} />
            </Link>
            <a 
              href="https://uit.uz" 
              target="_blank" 
              className={`flex items-center gap-1 text-sm font-medium transition-all relative group ${
                isScrolled 
                  ? 'text-white hover:text-white/80' 
                  : 'text-gray-600 hover:text-[#0056b3]'
              }`}
            >
              Universitet 
              <ExternalLink className="w-3 h-3 group-hover:rotate-45 transition-transform" />
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
                isScrolled ? 'bg-white' : 'bg-[#0056b3]'
              } group-hover:w-full`} />
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/profile" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    isScrolled 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-blue-50 text-[#0056b3] hover:bg-blue-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.short_name || 'Profil'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-xl transition-all ${
                    isScrolled ? 'text-white hover:bg-white/10' : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg ${
                  isScrolled 
                    ? 'bg-white text-[#0f172a] hover:bg-gray-100 shadow-white/10' 
                    : 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white hover:shadow-blue-500/25 shadow-blue-500/20'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

