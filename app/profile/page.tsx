'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Book, 
  ChevronRight, 
  LogOut, 
  Shield, 
  CreditCard,
  Building2,
  Clock,
  IdCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StudentSidebar from '@/components/StudentSidebar';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      {/* Sidebar */}
      <StudentSidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats and Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">O'rtacha ball (GPA)</p>
                    <p className="text-xl font-black text-gray-900">{user.avg_gpa}</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Kurs</p>
                    <p className="text-xl font-black text-gray-900">{user.level?.name || 'N/A'}</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Guruh</p>
                    <p className="text-xl font-black text-gray-900">{user.group?.name || 'N/A'}</p>
                  </div>
                </motion.div>
              </div>

              {/* O'quv ma'lumotlari */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">O'quv ma'lumotlari</h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Universitet:</p>
                      <p className="text-gray-900 font-black">{user.university?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fakultet:</p>
                      <p className="text-gray-900 font-black">{user.faculty?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mutaxassislik:</p>
                      <p className="text-gray-900 font-black">{user.specialty?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ta'lim shakli:</p>
                      <p className="text-gray-900 font-black">{user.educationForm?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">To'lov shakli:</p>
                      <p className="text-gray-900 font-black">{user.paymentForm?.name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Shaxsiy ma'lumotlar Sidebar */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-xl text-green-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">Shaxsiy ma'lumotlar</h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <IdCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID:</p>
                      <p className="text-sm font-black text-gray-900">{user.student_id_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Telefon:</p>
                      <p className="text-sm font-black text-gray-900">{user.phone || 'Kiritilmagan'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tug'ilgan sana:</p>
                      <p className="text-sm font-black text-gray-900">
                        {user.birth_date ? new Date(user.birth_date * 1000).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manzil:</p>
                      <p className="text-sm font-black text-gray-900 line-clamp-2">{user.address || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Turar joy:</p>
                      <p className="text-sm font-black text-gray-900">{user.accommodation?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
