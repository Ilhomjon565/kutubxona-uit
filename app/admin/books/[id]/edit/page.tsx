'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Book, Category, UpdateBookRequest } from '@/types';
import { booksApi, categoriesApi } from '@/lib/api';
import { ArrowLeft, Save, Upload, Edit } from 'lucide-react';

const EditBookPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateBookRequest>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && !isAdmin) {
      router.push('/');
      return;
    }
    loadBook();
    loadCategories();
  }, [user, isAdmin, authLoading, router, bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getById(bookId);
      if (response.message.includes('muvaffaqiyatli')) {
        setBook(response.book);
        reset({
          title: response.book.title,
          downloadLink: response.book.downloadLink,
          description: response.book.description,
          category: response.book.category,
        });
      }
    } catch (error) {
      console.error('Error loading book:', error);
      setError('Kitob yuklanmadi');
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

  const onSubmit = async (data: UpdateBookRequest) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('title', data.title || '');
      formData.append('downloadLink', data.downloadLink || '');
      formData.append('description', data.description || '');
      formData.append('category', data.category || '');
      
      if (coverImageFile) {
        formData.append('image', coverImageFile);
      }

      const response = await booksApi.update(bookId, formData as any);
      if (response.message.includes('muvaffaqiyatli') || response.message.includes('yaratildi') || response.message.includes('tahrirlandi')) {
        setSuccess('Kitob muvaffaqiyatli yangilandi!');
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (!book) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kitob topilmadi</h2>
            <button
              onClick={() => router.push('/admin')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin panelga qaytish
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Orqaga qaytish
            </button>
            <h1 className="text-3xl font-bold text-gray-900">📝 Kitobni tahrirlash</h1>
            <p className="text-gray-600 mt-2">
              "{book.title}" kitobini tahrirlang
            </p>
          </div>

          {/* Form */}
          <div className="bg-white shadow-xl rounded-xl p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📖 Kitob nomi
                </label>
                <input
                  {...register('title', { required: 'Kitob nomi kiritilishi shart' })}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Masalan: JavaScript dasturlash asoslari"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔗 Yuklab olish havolasi
                </label>
                <input
                  {...register('downloadLink', { required: 'Yuklab olish havolasi kiritilishi shart' })}
                  type="url"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://example.com/kitob.pdf"
                />
                {errors.downloadLink && (
                  <p className="text-red-600 text-sm mt-1">{errors.downloadLink.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Kitob tavsifi
                </label>
                <textarea
                  {...register('description', { required: 'Tavsif kiritilishi shart' })}
                  rows={4}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Kitob haqida qisqacha ma'lumot yozing..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏷️ Kategoriya
                </label>
                <select
                  {...register('category', { required: 'Kategoriya tanlanishi shart' })}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Kategoriyani tanlang...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🖼️ Kitob rasmi (ixtiyoriy)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Yangi rasm yuklash</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">yoki drag & drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PNG yoki boshqa rasm formatlari qabul qilinadi
                    </p>
                    {coverImageFile && (
                      <p className="text-sm text-green-600 font-medium">
                        ✅ {coverImageFile.name} tanlandi
                      </p>
                    )}
                    {book.image && !coverImageFile && (
                      <p className="text-sm text-blue-600 font-medium">
                        📷 Joriy rasm: {book.image.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ❌ Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Yangilanmoqda...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Yangilash
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBookPage;

