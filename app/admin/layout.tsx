'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user is on login page - allow access
    if (pathname === '/admin' || pathname === '/admin/') {
      setIsReady(true);
      return;
    }

    // For all other admin pages, check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  // If not on login page and no token, show loading
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

  if (!isReady && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0056b3]/10 via-white to-[#00a8ff]/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-[#0056b3] to-[#00a8ff] rounded-2xl animate-pulse">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-bold">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Tekshirilmoqda...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // If on login page, just show children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For other admin pages, show sidebar
  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}


