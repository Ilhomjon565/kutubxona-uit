'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { User, Save, ArrowLeft } from 'lucide-react';

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(data);
      setSuccess('Profil muvaffaqiyatli yangilandi');
      reset(data);
    } catch (err: any) {
      setError(err.message || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profilga kirish kerak
            </h2>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kirish
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Orqaga qaytish
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-2">
              Shaxsiy ma'lumotlaringizni yangilang
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ism
                    </label>
                    <input
                      {...register('firstName', {
                        required: 'Ism kiritilishi shart',
                        minLength: {
                          value: 2,
                          message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                      type="text"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Familiya
                    </label>
                    <input
                      {...register('lastName', {
                        required: 'Familiya kiritilishi shart',
                        minLength: {
                          value: 2,
                          message: 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                      type="text"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Foydalanuvchi nomi
                  </label>
                  <input
                    {...register('username', {
                      required: 'Foydalanuvchi nomi kiritilishi shart',
                      minLength: {
                        value: 3,
                        message: 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Foydalanuvchi nomi faqat harflar, raqamlar va _ belgisidan iborat bo\'lishi kerak',
                      },
                    })}
                    type="text"
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Hisob ma'lumotlari</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Rol:</span>
                      <span className="font-medium">
                        {user.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ro'yxatdan o'tgan sana:</span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
