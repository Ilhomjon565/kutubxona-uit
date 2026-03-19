'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { Search, BookOpen, ArrowRight, TrendingUp, Clock, Library, Sparkles, ChevronDown, Grid3x3, List, ChevronLeft, ChevronRight, Bell, BellOff, Lock, LogIn, Loader2, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBookNotifications } from '@/hooks/useBookNotifications';
import StudentSidebar from '@/components/StudentSidebar';

interface Book {
  _id: string;
  title: string;
  category: string;
  image: string;
  downloadUrl: string;
  views: number;
  downloads: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isWaiting2FA, setIsWaiting2FA] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [needs2FASetup, setNeeds2FASetup] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const itemsPerPage = 10;
  const hasTrackedViews = useRef(false);
  
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

  useEffect(() => {
    // Check if device is blocked in localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('isDeviceBlocked')) {
      setIsLoggedIn(false);
      setLoginError('Ushbu qurilma xavfsizlik sababli bloklangan!');
      return;
    }

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
      fetchBooks();
      fetchAllBooks();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  // Polling for 2FA status
  useEffect(() => {
    let interval: any;
    if (isWaiting2FA && requestId) {
      interval = setInterval(async () => {
        try {
          const { data } = await axios.get(`${API_URL}/auth/check-status/${requestId}`);
          
          if (data.status === 'approved') {
            clearInterval(interval);
            localStorage.setItem('token', data.token);
            
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
              setIsLoggedIn(true);
              setUser(data.user);
              setIsWaiting2FA(false);
              setRequestId(null); // Clear request ID
              fetchBooks();
              fetchAllBooks();
            } else {
              // If no user data (e.g. HEMIS down), but token exists, try to continue
              setIsLoggedIn(true);
              setIsWaiting2FA(false);
              setRequestId(null);
              fetchBooks();
              fetchAllBooks();
            }
          } else if (data.status === 'blocked') {
            clearInterval(interval);
            setIsWaiting2FA(false);
            setRequestId(null); // Clear request ID
            setLoginError('Sizning kirish so\'rovingiz rad etildi va qurilmangiz bloklandi!');
            localStorage.setItem('isDeviceBlocked', 'true');
          }
        } catch (error) {
          console.error('Check status error:', error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isWaiting2FA, requestId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localStorage.getItem('isDeviceBlocked')) return;

    setLoading(true);
    setLoginError('');

    try {
      const deviceInfo = typeof window !== 'undefined' ? `${window.navigator.platform} - ${window.navigator.userAgent.split(') ')[0]})` : 'Unknown';
      
      const response = await axios.post(`${API_URL}/auth/hemis-login`, {
        login,
        password,
        deviceInfo
      });

      if (response.data.needs_2fa_setup) {
        setNeeds2FASetup(true);
        setReferralLink(response.data.referralLink);
        setLoading(false);
      } else if (response.data.two_factor) {
        setIsWaiting2FA(true);
        setRequestId(response.data.requestId);
        setLoading(false);
      } else if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        setUser(response.data.user);
        fetchBooks();
        fetchAllBooks();
      } else {
        setLoginError(response.data.message || 'Login xatosi');
        setLoading(false);
      }
    } catch (err: any) {
      if (err.response?.data?.blocked) {
        localStorage.setItem('isDeviceBlocked', 'true');
      }
      setLoginError(err.response?.data?.message || 'Tizimga ulanishda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
    }
  }, [currentPage, selectedCategory, search, isLoggedIn]);

  const fetchAllBooks = async () => {
    if (!isLoggedIn) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';
      const { data } = await axios.get(`${apiUrl}/books?limit=1000`);
      const booksData = Array.isArray(data) ? data : data.books || [];
      setAllBooks(booksData);
      const uniqueCategories = ['Barchasi', ...new Set(booksData.map((book: Book) => book.category))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching all books:', error);
    }
  };

  const fetchBooks = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';
      const categoryParam = selectedCategory !== 'Barchasi' ? selectedCategory : '';
      const searchParam = search.trim();

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (categoryParam) params.append('category', categoryParam);
      if (searchParam) params.append('search', searchParam);

      const { data } = await axios.get(`${apiUrl}/books?${params.toString()}`);

      if (data.pagination) {
        setBooks(data.books || []);
        setPagination(data.pagination);
        if (data.categories) {
          setCategories(['Barchasi', ...data.categories]);
        }
      } else {
        // Fallback for old API format
        const booksData = Array.isArray(data) ? data : [];
        setBooks(booksData);
        setPagination(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const popularBooks = useMemo(() =>
    [...allBooks].sort((a, b) => b.views - a.views).slice(0, 5),
    [allBooks]
  );

  const latestBooks = useMemo(() =>
    [...allBooks].sort((a, b) => b._id.localeCompare(a._id)).slice(0, 5),
    [allBooks]
  );

  // Track views for books shown on homepage (popular and latest)
  // Track only when books are displayed on homepage (Barchasi category, no search)
  useEffect(() => {
    if (selectedCategory === 'Barchasi' && !search && popularBooks.length > 0 && latestBooks.length > 0) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz/api';

      // Combine popular and latest books, remove duplicates
      const booksToTrack = [...popularBooks, ...latestBooks];
      const uniqueBookIds = new Set<string>();
      const uniqueBooks: Book[] = [];

      booksToTrack.forEach(book => {
        if (!uniqueBookIds.has(book._id)) {
          uniqueBookIds.add(book._id);
          uniqueBooks.push(book);
        }
      });

      // Track views for each book (only once per page load)
      uniqueBooks.forEach((book) => {
        axios.post(`${apiUrl}/books/${book._id}/view`)
          .catch(() => {
            // Silently fail - don't show errors for view tracking
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, search]); // Track when category or search changes, not when books data changes

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe]">
      {isLoggedIn === null ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#0056b3] animate-spin" />
        </div>
      ) : isLoggedIn ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <StudentSidebar user={user} />

          {/* Main Content Area */}
          <main className="flex-1 min-h-screen">
            <section id="books-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
              {/* Header inside Main Content */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kutubxona</h1>
                  <p className="text-sm text-gray-500 font-medium">Xush kelibsiz, {user?.full_name}</p>
                </div>
                
                {/* Search Bar in Header */}
                <div className="w-full max-w-md relative group">
                  <div className="absolute inset-0 bg-blue-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <form onSubmit={handleSearch} className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Kitob qidirish..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                </div>
              </div>

              {/* Filters & Categories Row */}
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border ${
                        selectedCategory === cat 
                          ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white border-transparent shadow-blue-500/20' 
                          : 'bg-white text-gray-600 border-gray-50 hover:border-blue-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-50 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Books Display */}
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory === 'Barchasi' ? 'Barcha kitoblar' : selectedCategory}
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full">
                    {pagination?.totalItems || 0} ta natija
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(itemsPerPage)].map((_, i) => (
                      <div key={i} className="animate-pulse space-y-4">
                        <div className="aspect-[3/4] bg-gray-100 rounded-[2.5rem]" />
                        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                        <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : books.length > 0 ? (
                  <>
                    <div className={
                      viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        : "space-y-4"
                    }>
                      {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 pt-16">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className="p-3 rounded-2xl bg-white border border-gray-100 disabled:opacity-30 hover:border-blue-500 transition-all shadow-sm"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1
                                ? 'bg-[#0f172a] text-white shadow-xl'
                                : 'bg-white border border-gray-100 hover:border-blue-500 text-gray-600 shadow-sm'
                                }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className="p-3 rounded-2xl bg-white border border-gray-100 disabled:opacity-30 hover:border-blue-500 transition-all shadow-sm"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                      <Library className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Hech narsa topilmadi</h3>
                    <p className="text-gray-500 font-medium">Boshqa so'rov yoki kategoriya tanlang</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      ) : (
        /* Direct Login Form when not authenticated */
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100"
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
                  <Image 
                    src="/headerlogo.png" 
                    alt="Logo"
                    className="relative w-36 h-auto object-contain mx-auto" 
                    width={144} 
                    height={40}
                  />
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">
                {needs2FASetup ? '2FA Himoyasi' : isWaiting2FA ? 'Tasdiqlash kutilmoqda' : 'Xush kelibsiz!'}
              </h2>
              <p className="mt-3 text-sm text-gray-500 font-medium">
                {needs2FASetup 
                  ? 'Hisobingizni xavfsizligini ta\'minlash uchun Telegram boti orqali 2FA ni yoqing.'
                  : isWaiting2FA 
                  ? 'Kirish so\'rovi Telegram guruhga yuborildi. Iltimos, admin tasdiqlashini kuting.' 
                  : 'Kutubxonadan foydalanish uchun HEMIS login parolingiz orqali kiring'}
              </p>
            </div>

            {needs2FASetup ? (
              <div className="mt-10 space-y-6 text-center">
                <div className="relative flex justify-center mb-4">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
                  <div className="relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Bell className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <a 
                  href={referralLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#0088cc] text-white rounded-2xl font-black shadow-lg shadow-[#0088cc]/30 hover:shadow-xl hover:shadow-[#0088cc]/40 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.62-.2-1.11-.31-1.07-.65.02-.18.27-.36.75-.55 2.94-1.28 4.91-2.12 5.89-2.52 2.81-1.15 3.39-1.35 3.77-1.35.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  Telegramda yoqish
                </a>
                <button 
                  onClick={() => setNeeds2FASetup(false)}
                  className="text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Orqaga qaytish
                </button>
              </div>
            ) : isWaiting2FA ? (
              <div className="mt-10 flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <Loader2 className="w-12 h-12 text-[#0056b3] animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-blue-600 font-black animate-pulse">Kutilmoqda...</p>
                  <button 
                    onClick={() => { setIsWaiting2FA(false); setRequestId(null); }}
                    className="text-sm text-gray-400 hover:text-red-500 font-bold transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            ) : (
              <form className="mt-10 space-y-6" onSubmit={handleLogin}>
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3"
                  >
                    <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-bold">{loginError}</p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={localStorage.getItem('isDeviceBlocked') !== null}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:bg-white transition-all font-medium"
                      placeholder="HEMIS Login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      disabled={localStorage.getItem('isDeviceBlocked') !== null}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:bg-white transition-all font-medium"
                      placeholder="Parol"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || localStorage.getItem('isDeviceBlocked') !== null}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-[#0056b3] to-[#00a8ff] hover:from-[#004494] hover:to-[#0088cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056b3] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-500/25"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Kirish <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-6 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                University of Innovation Technologies
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
