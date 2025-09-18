'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, User, LogOut, Menu, X, Settings, Library } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UIT Kutubxona</h1>
              <p className="text-xs text-gray-500">Innovatsion Texnologiyalar Universiteti</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bosh sahifa
            </Link>
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kitoblar
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kategoriyalar
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bosh sahifa
              </Link>
              <Link
                href="/books"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kitoblar
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriyalar
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              {user ? (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Chiqish
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-2">
                  <Link
                    href="/register"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ro'yxatdan o'tish
                  </Link>
                  <Link
                    href="/login"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kirish
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

