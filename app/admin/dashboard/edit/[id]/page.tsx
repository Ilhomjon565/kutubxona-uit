'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import BookForm from '@/components/BookForm';
import { useParams } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function EditBook() {
    const params = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
                const { data } = await axios.get(`${apiUrl}/api/books/${params.id}`);
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        if (params.id) {
            fetchBook();
        }
    }, [params.id]);

    if (!book) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex justify-center items-center text-[#0056b3]">
                    Yuklanmoqda...
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-[#0056b3]">Kitobni Tahrirlash</h1>
                    <BookForm initialData={book} isEdit />
                </div>
            </div>
        </div>
    );
}
