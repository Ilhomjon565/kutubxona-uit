'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Logo from './Logo';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0f172a] border-b border-white/10 backdrop-blur-xl' 
        : 'glass-enhanced border-b border-gray-100/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-3 group magnetic">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3] to-[#00a8ff] rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <Logo 
                src="/logo.png"
                className="relative w-12 h-12 object-contain group-hover:scale-110 transition-all duration-500 drop-shadow-lg"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold leading-tight group-hover:text-[#0056b3] transition-colors ${
                isScrolled ? 'text-white' : 'text-[#0f172a]'
              }`}>
                UIT
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${
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
          </div>
        </div>
      </div>
    </nav>
  );
}

