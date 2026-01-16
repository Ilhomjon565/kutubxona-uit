'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchBooks();
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
      const { data } = await axios.get(`${apiUrl}/api/books?limit=1`);
      if (data.categories) {
        setCategories(['Barchasi', ...data.categories]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Barcha Kitoblar - UIT Kutubxona",
            "description": "UIT Kutubxonasidagi barcha elektron kitoblar, darsliklar va ilmiy adabiyotlar",
            "url": `${siteUrl}/books`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": pagination?.totalItems || books.length,
              "itemListElement": books.slice(0, 10).map((book, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Book",
                  "name": book.title,
                  "category": book.category
                }
              }))
            }
          }),
        }}
      />
      <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-[#0056b3] selection:text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3]/5 to-[#00a8ff]/5 z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#0056b3] hover:text-[#004494] mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Asosiy sahifaga qaytish</span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <span className="text-[#0056b3] font-bold text-xl tracking-widest uppercase">UIT Kutubxona</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight text-[#0f172a]"
            >
              Raqamli <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0056b3] to-[#00a8ff]">Kutubxona</span>
            </motion.h1>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto relative"
            >
              <input
                type="text"
                placeholder="Kitoblarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 shadow-xl shadow-[#0056b3]/5 text-lg placeholder-gray-400 transition-all"
              />
              <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
            </motion.form>
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
                onClick={() => handleCategoryChange(category)}
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

        {/* Book Grid with Pagination */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0056b3]"></div>
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  {pagination 
                    ? `${pagination.totalItems} ta kitobdan ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, pagination.totalItems)} tasi ko'rsatilmoqda`
                    : `${books.length} ta kitob topildi`
                  }
                </p>
              </div>

              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
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
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              currentPage === page
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
            <div className="text-center py-20 text-gray-500 text-xl">
              Siz qidirgan kitoblar topilmadi.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
