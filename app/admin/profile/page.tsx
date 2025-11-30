'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AdminSidebar from '@/components/AdminSidebar';
import { User, Save, Lock } from 'lucide-react';

interface ProfileData {
    username: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileData>();

    const newPassword = watch('newPassword');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin');
            return;
        }
        fetchProfile();
    }, [router]);

    const fetchProfile = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${apiUrl}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(data);
            reset({ username: data.username });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProfileData) => {
        setSaving(true);
        setMessage(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const token = localStorage.getItem('adminToken');

            // Prepare update data
            const updateData: any = {
                username: data.username,
            };

            // Only include password fields if new password is provided
            if (data.newPassword) {
                updateData.currentPassword = data.currentPassword;
                updateData.newPassword = data.newPassword;
            }

            const response = await axios.put(`${apiUrl}/api/auth/profile`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage({ type: 'success', text: response.data.message || 'Profil muvaffaqiyatli yangilandi' });
            setProfile(response.data);
            
            // Clear password fields
            reset({
                username: response.data.username,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Profilni yangilashda xatolik yuz berdi',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0056b3]">Profil Sozlamalari</h1>
                        <p className="text-gray-500 mt-2">Profil ma'lumotlarini yangilash</p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Profile Form */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Username Section */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4" />
                                    Foydalanuvchi nomi
                                </label>
                                <input
                                    {...register('username', {
                                        required: 'Foydalanuvchi nomi kiritilishi shart',
                                        minLength: {
                                            value: 3,
                                            message: 'Foydalanuvchi nomi kamida 3 belgi bo\'lishi kerak',
                                        },
                                    })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                                    placeholder="Foydalanuvchi nomi"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Password Change Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                                    <Lock className="w-4 h-4" />
                                    Parolni o'zgartirish (ixtiyoriy)
                                </div>

                                {/* Current Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Joriy parol
                                    </label>
                                    <input
                                        type="password"
                                        {...register('currentPassword', {
                                            validate: (value) => {
                                                const newPass = watch('newPassword');
                                                if (newPass && !value) {
                                                    return 'Yangi parol kiritilganda joriy parol kiritilishi shart';
                                                }
                                                return true;
                                            },
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                                        placeholder="Joriy parol"
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yangi parol
                                    </label>
                                    <input
                                        type="password"
                                        {...register('newPassword', {
                                            minLength: {
                                                value: 6,
                                                message: 'Parol kamida 6 belgi bo\'lishi kerak',
                                            },
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                                        placeholder="Yangi parol"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yangi parolni tasdiqlash
                                    </label>
                                    <input
                                        type="password"
                                        {...register('confirmPassword', {
                                            validate: (value) => {
                                                if (newPassword && value !== newPassword) {
                                                    return 'Parollar mos kelmaydi';
                                                }
                                                return true;
                                            },
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                                        placeholder="Yangi parolni qayta kiriting"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0056b3] text-white rounded-lg hover:bg-[#004494] transition-colors shadow-lg shadow-[#0056b3]/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


