'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { Search, BookOpen, ArrowRight, TrendingUp, Clock, Library, Sparkles, ChevronDown, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
  const itemsPerPage = 10;
  const hasTrackedViews = useRef(false);

  useEffect(() => {
    fetchBooks();
    fetchAllBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, selectedCategory, search]);

  const fetchAllBooks = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
      const { data } = await axios.get(`${apiUrl}/api/books?limit=1000`);
      const booksData = Array.isArray(data) ? data : data.books || [];
      setAllBooks(booksData);
      const uniqueCategories = ['Barchasi', ...new Set(booksData.map((book: Book) => book.category))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching all books:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
      const categoryParam = selectedCategory !== 'Barchasi' ? selectedCategory : '';
      const searchParam = search.trim();

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (categoryParam) params.append('category', categoryParam);
      if (searchParam) params.append('search', searchParam);

      const { data } = await axios.get(`${apiUrl}/api/books?${params.toString()}`);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';

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
        axios.post(`${apiUrl}/api/books/${book._id}/view`)
          .catch(() => {
            // Silently fail - don't show errors for view tracking
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, search]); // Track when category or search changes, not when books data changes

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  return (
    <div className="flex flex-col gap-10">
      {/* Dynamic Hero Section with Advanced Animations */}
      <section className="relative min-h-[600px] flex items-center py-20 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0056b3]/20 rounded-full blur-[120px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00a8ff]/20 rounded-full blur-[120px]"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          {/* Floating Particles */}
          {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                opacity: Math.random(),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">University of Innovation Technologies</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
              Bilimlar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#0056b3]">Olamiga Marhamat</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              UIT raqamli kutubxonasi yordamida eng so'nggi darsliklar, ilmiy adabiyotlar va badiiy kitoblarni istalgan vaqtda toping va yuklab oling.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <motion.div
                className="flex-1 relative group"
                whileFocus={{ scale: 1.02 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Kitob nomini qidiring..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0056b3]/20 text-gray-900 shadow-2xl transition-all"
                />
              </motion.div>
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#0056b3] to-[#00a8ff] hover:from-[#004494] hover:to-[#0099e6] text-white rounded-2xl font-bold shadow-xl shadow-[#0056b3]/20 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 86, 179, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Qidirish
                </motion.span>
              </motion.button>
            </form>

            <motion.div
              className="flex items-center gap-8 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.1 }}
              >
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  {allBooks.length}+
                </motion.span>
                <span className="text-sm text-gray-400">Kitoblar</span>
              </motion.div>
              <div className="w-[1px] h-10 bg-white/10" />
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.1 }}
              >
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                >
                  10k+
                </motion.span>
                <span className="text-sm text-gray-400">Yuklab olishlar</span>
              </motion.div>
              <div className="w-[1px] h-10 bg-white/10" />
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.1 }}
              >
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                >
                  {categories.length - 1}
                </motion.span>
                <span className="text-sm text-gray-400">Kategoriyalar</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -20, 0]
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 1 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />
              <Image
                src="/headerlogo.png"
                alt="UIT Logo"
                width={400}
                height={400}
                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                priority
                quality={90}
                unoptimized={false}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-[#0056b3] rounded-2xl rotate-12 opacity-20 blur-xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-10 w-24 h-24 bg-[#00a8ff] rounded-full opacity-20 blur-xl animate-pulse delay-700" />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="sticky top-16 z-40 bg-[#fcfdfe]/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Dropdown for Mobile, Grid for Desktop */}
            <div className="w-full lg:w-auto flex items-center gap-4">
              {/* Mobile Dropdown */}
              <div className="lg:hidden relative w-full">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-[#0056b3] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4" />
                    {selectedCategory}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50"
                    >
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${selectedCategory === category ? 'bg-[#0056b3] text-white' : 'text-gray-700'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Grid */}
              <div className="hidden lg:flex items-center gap-3 flex-wrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border relative overflow-hidden ${selectedCategory === category
                      ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white border-transparent shadow-lg shadow-[#0056b3]/30'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#0056b3] hover:text-[#0056b3] hover:shadow-md'
                      }`}
                  >
                    {selectedCategory === category && (
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-[#0056b3] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                  ? 'bg-[#0056b3] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        {/* Popular Books Section - Only if Barchasi is selected and no search */}
        {selectedCategory === 'Barchasi' && !search && popularBooks.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Mashhur Kitoblar</h2>
                  <p className="text-sm text-gray-500">Eng ko'p ko'rilgan kitoblar to'plami</p>
                </div>
              </div>
              <Link href="/books">
                <button className="text-sm font-bold text-[#0056b3] cursor-pointer hover:underline flex items-center gap-1">
                  Barchasi <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {popularBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Books Section - Only if Barchasi is selected and no search */}
        {selectedCategory === 'Barchasi' && !search && latestBooks.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-[#0056b3] rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Eng So'nggi Qo'shilganlar</h2>
                  <p className="text-sm text-gray-500">Yaqinda yuklangan yangi adabiyotlar</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {latestBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Main Books Grid Section with Pagination */}
        <section id="books" className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 text-gray-900 rounded-xl">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  {selectedCategory === 'Barchasi' ? 'Barcha Kitoblar' : selectedCategory}
                </h2>
                <p className="text-sm text-gray-500">
                  {pagination ? `${pagination.totalItems} ta kitob topildi` : `${books.length} ta kitob`}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              : 'grid-cols-1'
              }`}>
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : books.length > 0 ? (
            <>
              <motion.div
                layout
                className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                  : 'grid-cols-1'
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="popLayout">
                  {books.map((book, index) => (
                    <motion.div
                      key={book._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 pt-8"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === page
                              ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white shadow-lg'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 py-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hech narsa topilmadi</h3>
              <p className="text-gray-500">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
