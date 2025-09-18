'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import BookDetailModal from '@/components/BookDetailModal';
import { Book, Category } from '@/types';
import { booksApi, categoriesApi } from '@/lib/api';
import { BookOpen, TrendingUp, Users, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll({
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        limit: 12,
      });
      
      if (response.message.includes('muvaffaqiyatli')) {
        setBooks(response.books);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      if (response.message === 'Kategoriyalar muvaffaqiyatli olingan') {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Jami kitoblar',
      value: '1,200+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      label: 'Foydalanuvchilar',
      value: '500+',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      label: 'Kategoriyalar',
      value: '15+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Award,
      label: 'Yangi kitoblar',
      value: '50+',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              UIT Kutubxona
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Innovatsion Texnologiyalar Universiteti raqamli kutubxonasi
            </p>
            <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
              Zamonaviy ta'lim va innovatsion texnologiyalar asosida malakali mutaxassislar 
              tayyorlash uchun keng kitoblar to'plami
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kitoblar to'plami
            </h2>
            <p className="text-lg text-gray-600">
              O'zingizga kerakli kitobni toping va o'qing
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterClick={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Filtrlar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategoriya
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Barcha kategoriyalar</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onView={handleViewBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Kitoblar topilmadi
              </h3>
              <p className="text-gray-500">
                Qidiruv so'rovingizga mos kitoblar topilmadi. Boshqa kalit so'zlar bilan qidiring.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={showBookModal}
        onClose={() => {
          setShowBookModal(false);
          setSelectedBook(null);
        }}
      />
    </Layout>
  );
};

export default HomePage;