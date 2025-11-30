'use client';

import BookForm from '@/components/BookForm';
import AdminSidebar from '@/components/AdminSidebar';

export default function CreateBook() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-[#0056b3]">Yangi Kitob Qo'shish</h1>
                    <BookForm />
                </div>
            </div>
        </div>
    );
}
