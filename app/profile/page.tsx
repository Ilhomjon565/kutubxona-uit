'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Book, School, GraduationCap, MapPin, 
  Phone, Mail, Calendar, LogOut, ChevronRight, 
  BadgeCheck, Award, Briefcase, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-sky-400" />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                <img 
                  src={user.image || '/logo.png'} 
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover relative z-10 transition-transform duration-500 group-hover/avatar:scale-105"
                  onError={(e: any) => e.target.src = '/logo.png'}
                />
                <div className="absolute bottom-1 right-1 bg-green-500 border-4 border-white w-6 h-6 rounded-full z-20 shadow-sm" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{user.full_name}</h3>
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mt-1">{user.studentStatus?.name}</p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-all">
                <User className="w-5 h-5" />
                <span>Profil</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all group">
                <Book className="w-5 h-5 group-hover:text-blue-600" />
                <span>Kitoblar</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">O'rtacha ball (GPA)</p>
                <p className="text-2xl font-bold text-gray-900">{user.avg_gpa}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 group hover:border-purple-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Kurs</p>
                <p className="text-2xl font-bold text-gray-900">{user.level?.name}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 group hover:border-orange-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Guruh</p>
                <p className="text-2xl font-bold text-gray-900">{user.group?.name}</p>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academic Info */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  O'quv ma'lumotlari
                </h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 font-medium">Universitet:</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{user.university}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 font-medium">Fakultet:</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{user.faculty?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 font-medium">Mutaxassislik:</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{user.specialty?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 font-medium">Ta'lim shakli:</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{user.educationForm?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 font-medium">To'lov shakli:</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{user.paymentForm?.name}</span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                  Shaxsiy ma'lumotlar
                </h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>ID:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{user.student_id_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>Telefon:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{user.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Tug'ilgan sana:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {new Date(user.birth_date * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Manzil:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 text-right max-w-[200px]">{user.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Briefcase className="w-4 h-4" />
                    <span>Turar joy:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{user.accommodation?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
