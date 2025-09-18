'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import BookManagement from '@/components/admin/BookManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import UserManagement from '@/components/admin/UserManagement';
import StatisticsDashboard from '@/components/admin/StatisticsDashboard';
import { BookOpen, Settings, Users, BarChart3 } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'categories' | 'users' | 'stats'>('books');

  if (loading) {
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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profilga kirish kerak
            </h2>
            <p className="text-gray-600 mb-4">
              Admin paneliga kirish uchun tizimga kiring
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ruxsat yo'q
            </h2>
            <p className="text-gray-600">
              Sizda admin paneliga kirish huquqi yo'q
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'books', label: 'Kitoblar', icon: BookOpen },
    { id: 'categories', label: 'Kategoriyalar', icon: Settings },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'stats', label: 'Statistika', icon: BarChart3 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">
              Kutubxona tizimini boshqaring
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow rounded-lg">
            {activeTab === 'books' && <BookManagement />}
            {activeTab === 'categories' && <CategoryManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'stats' && <StatisticsDashboard />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
