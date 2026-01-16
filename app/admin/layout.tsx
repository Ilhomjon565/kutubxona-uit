'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is on login page - allow access
    if (pathname === '/admin' || pathname === '/admin/') {
      return;
    }

    // For all other admin pages, check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    }
  }, [pathname, router]);

  // If not on login page and no token, show loading
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

  if (!isLoginPage && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0056b3]/10 via-white to-[#00a8ff]/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-[#0056b3] to-[#00a8ff] rounded-2xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}


