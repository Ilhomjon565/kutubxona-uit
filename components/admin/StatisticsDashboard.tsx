'use client';

import React, { useState, useEffect } from 'react';
import { Book, Category } from '@/types';
import { booksApi, categoriesApi } from '@/lib/api';
import { BookOpen, Users, TrendingUp, Award, Calendar, BarChart3, PieChart } from 'lucide-react';

const StatisticsDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
    totalCategories: 0,
    booksThisYear: 0,
    booksThisMonth: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load books
      const booksResponse = await booksApi.getAll({ limit: 1000 });
      if (booksResponse.message.includes('muvaffaqiyatli')) {
        setBooks(booksResponse.books);
      }

      // Load categories
      const categoriesResponse = await categoriesApi.getAll();
      if (categoriesResponse.message === 'Kategoriyalar muvaffaqiyatli olingan') {
        setCategories(categoriesResponse.categories);
      }

      // Calculate statistics
      calculateStats(booksResponse.books || [], categoriesResponse.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (booksData: Book[], categoriesData: Category[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const booksThisYear = booksData.filter(book => 
      new Date(book.createdAt || '').getFullYear() === currentYear
    ).length;
    
    const booksThisMonth = booksData.filter(book => {
      const bookDate = new Date(book.createdAt || '');
      return bookDate.getFullYear() === currentYear && bookDate.getMonth() === currentMonth;
    }).length;

    setStats({
      totalBooks: booksData.length,
      availableBooks: booksData.filter(book => book.isAvailable).length,
      unavailableBooks: booksData.filter(book => !book.isAvailable).length,
      totalCategories: categoriesData.length,
      booksThisYear,
      booksThisMonth,
    });
  };

  const getCategoryStats = () => {
    const categoryCounts: { [key: string]: number } = {};
    
    books.forEach(book => {
      const categoryName = book.category?.name || 'Kategoriya yo\'q';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getRecentBooks = () => {
    return books
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Statistika yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Statistika</h3>
        <p className="text-gray-600">Kutubxona tizimi statistikasi</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jami kitoblar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mavjud kitoblar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kategoriyalar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bu yil qo'shilgan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booksThisYear}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Kategoriyalar bo'yicha taqsimot</h4>
          </div>
          <div className="space-y-3">
            {getCategoryStats().map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Books */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">So'nggi qo'shilgan kitoblar</h4>
          </div>
          <div className="space-y-3">
            {getRecentBooks().map((book, index) => (
              <div key={book._id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {book.createdAt ? new Date(book.createdAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Kitoblar holati</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mavjud</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalBooks > 0 ? (stats.availableBooks / stats.totalBooks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.availableBooks}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mavjud emas</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalBooks > 0 ? (stats.unavailableBooks / stats.totalBooks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.unavailableBooks}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Oylik statistika</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.booksThisMonth}</p>
            <p className="text-sm text-gray-600">Bu oy qo'shilgan kitoblar</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Yillik statistika</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.booksThisYear}</p>
            <p className="text-sm text-gray-600">Bu yil qo'shilgan kitoblar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;

