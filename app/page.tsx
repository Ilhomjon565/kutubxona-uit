'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { Search, BookOpen, ArrowRight, TrendingUp, Clock, Library, Sparkles } from 'lucide-react';
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

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, search]);

  const fetchBooks = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
      const { data } = await axios.get(`${apiUrl}/api/books`);
      setBooks(data);
      const uniqueCategories = ['Barchasi', ...new Set(data.map((book: Book) => book.category))];
      setCategories(uniqueCategories as string[]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const filterBooks = useCallback(() => {
    let result = books;
    if (selectedCategory !== 'Barchasi') {
      result = result.filter((book) => book.category === selectedCategory);
    }
    if (search) {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredBooks(result);
  }, [books, selectedCategory, search]);

  const popularBooks = useMemo(() => 
    [...books].sort((a, b) => b.views - a.views).slice(0, 5),
    [books]
  );
  
  const latestBooks = useMemo(() => 
    [...books].sort((a, b) => b._id.localeCompare(a._id)).slice(0, 5),
    [books]
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  return (
    <div className="flex flex-col gap-10">
      {/* Dynamic Hero Section with Advanced Animations */}
      <section className="relative min-h-[600px] flex items-center py-20 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs - Optimized */}
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0056b3]/15 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00a8ff]/15 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: '10s', animationDelay: '1s' }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8 animate-fade-in">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0056b3] transition-colors z-10 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Kitob nomini qidiring..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0056b3]/20 text-gray-900 shadow-2xl transition-all"
                />
              </div>
              <button 
                className="px-8 py-4 bg-gradient-to-r from-[#0056b3] to-[#00a8ff] hover:from-[#004494] hover:to-[#0099e6] text-white rounded-2xl font-bold shadow-xl shadow-[#0056b3]/20 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Qidirish
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex flex-col hover:scale-105 transition-transform">
                <span className="text-3xl font-bold text-white">
                  {books.length}+
                </span>
                <span className="text-sm text-gray-400">Kitoblar</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col hover:scale-105 transition-transform">
                <span className="text-3xl font-bold text-white">
                  10k+
                </span>
                <span className="text-sm text-gray-400">Yuklab olishlar</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col hover:scale-105 transition-transform">
                <span className="text-3xl font-bold text-white">
                  {categories.length}
                </span>
                <span className="text-sm text-gray-400">Kategoriyalar</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative animate-float">
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#0056b3]/20 to-[#00a8ff]/20 rounded-3xl blur-2xl" />
              <div className="relative w-[400px] h-[400px] mx-auto">
                <Image
                  src="/logo.png"
                  alt="UIT Logo"
                  fill
                  className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                  priority
                  quality={90}
                  unoptimized={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Scroll with Animation */}
      <section className="sticky top-16 z-40 bg-[#fcfdfe]/80 backdrop-blur-md border-b border-gray-100/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border relative overflow-hidden hover:scale-105 active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white border-transparent shadow-lg shadow-[#0056b3]/30 scale-105'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-[#0056b3] hover:text-[#0056b3] hover:shadow-md'
                }`}
              >
                <span className="relative z-10">{category}</span>
              </button>
            ))}
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
              <button className="text-sm font-bold text-[#0056b3] hover:underline flex items-center gap-1">
                Barchasi <ArrowRight className="w-4 h-4" />
              </button>
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

        {/* Main Books Grid Section */}
        <section id="books" className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-900 rounded-xl">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                {selectedCategory === 'Barchasi' ? 'Barcha Kitoblar' : selectedCategory}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredBooks.length} ta kitob topildi
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
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
