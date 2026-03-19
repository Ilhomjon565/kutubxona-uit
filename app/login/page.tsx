'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogIn, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/hemis-login`, {
        login,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/profile');
      } else {
        setError(response.data.message || 'Login xatosi');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tizimga ulanishda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
              <Logo 
                src="/headerlogo.png" 
                className="relative w-32 h-auto object-contain mx-auto" 
                width={128} 
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-[#0f172a]">Xush kelibsiz!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Kutubxonadan foydalanish uchun HEMIS login parolingiz orqali kiring
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-shake">
              <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:border-transparent transition-all sm:text-sm"
                placeholder="HEMIS Login (12 xonali raqam)"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:border-transparent transition-all sm:text-sm"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#0056b3] to-[#00a8ff] hover:from-[#004494] hover:to-[#0088cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056b3] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Kirish
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#0056b3] transition-colors">
            ← Asosiy sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
