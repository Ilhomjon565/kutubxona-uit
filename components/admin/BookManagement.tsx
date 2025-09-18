'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Category } from '@/types';
import { booksApi, categoriesApi } from '@/lib/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const BookManagement: React.FC = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll({
        search: searchTerm || undefined,
        limit: 50,
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

  const handleEdit = (book: Book) => {
    router.push(`/admin/books/${book._id}/edit`);
  };

  const handleAddNew = () => {
    router.push('/admin/books/new');
  };

  const handleDelete = async (bookId: string) => {
    const book = books.find(b => b._id === bookId);
    const bookTitle = book ? book.title : 'Bu kitob';
    
    if (window.confirm(`⚠️ ${bookTitle} kitobini o'chirishni xohlaysizmi?\n\nBu amalni qaytarib bo'lmaydi!`)) {
      try {
        setError('');
        setSuccess('');
        const response = await booksApi.delete(bookId);
        if (response.message.includes('muvaffaqiyatli') || response.message.includes('o\'chirildi')) {
          setSuccess(`✅ ${bookTitle} kitobi muvaffaqiyatli o'chirildi`);
          loadBooks(); // Refresh the books list
        }
      } catch (err: any) {
        setError(`❌ ${bookTitle} kitobini o'chirishda xatolik: ${err.message || 'Noma\'lum xatolik'}`);
      }
    }
  };

  // Remove modal-related functions as we're using separate pages now

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Kitoblar boshqaruvi</h3>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yangi kitob
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kitob qidirish..."
            className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategoriya
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tavsif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Kitoblar topilmadi
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {book.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">
                      {book.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BookManagement;
