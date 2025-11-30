'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

  const filterBooks = () => {
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
  };

  // Group books by category
  const groupBooksByCategory = () => {
    const grouped: { [key: string]: Book[] } = {};
    
    filteredBooks.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });
    
    return grouped;
  };

  const groupedBooks = groupBooksByCategory();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "UIT Kutubxona",
            "url": siteUrl,
            "description": "University of Innovation Technologies raqamli kutubxonasi",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/books?search={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-[#0056b3] selection:text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3]/5 to-[#00a8ff]/5 z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              {/* Placeholder for Logo if needed, or just text */}
              <span className="text-[#0056b3] font-bold text-xl tracking-widest uppercase">UIT Kutubxona</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight text-[#0f172a]"
            >
              Raqamli <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0056b3] to-[#00a8ff]">Kutubxona</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto"
            >
              University of Innovation Technologies raqamli kutubxonasi
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative mb-6"
            >
              <input
                type="text"
                placeholder="Kitoblarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 shadow-xl shadow-[#0056b3]/5 text-lg placeholder-gray-400 transition-all"
              />
              <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Link
                href="/about"
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#0056b3] rounded-xl hover:bg-gray-50 transition-all border-2 border-[#0056b3] font-semibold"
              >
                Biz haqimizda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#0056b3] text-white shadow-lg shadow-[#0056b3]/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Book Grid - Grouped by Category */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0056b3]"></div>
            </div>
          ) : Object.keys(groupedBooks).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedBooks).map(([category, categoryBooks]) => (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#0f172a]">{category}</h2>
                    <span className="px-3 py-1 bg-[#0056b3]/10 text-[#0056b3] rounded-full text-sm font-medium">
                      {categoryBooks.length} {categoryBooks.length === 1 ? 'kitob' : 'kitob'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categoryBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-xl">
              Siz qidirgan kitoblar topilmadi.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
