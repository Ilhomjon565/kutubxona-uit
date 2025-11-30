'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface BookFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function BookForm({ initialData, isEdit = false }: BookFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            title: '',
            category: '',
            downloadUrl: '',
        },
    });
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const router = useRouter();
    
    // Get initial image preview URL
    const getInitialImagePreview = () => {
        if (!initialData?.image) return null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
        if (initialData.image.startsWith('http')) {
            return initialData.image;
        } else if (initialData.image.startsWith('/uploads')) {
            return `${apiUrl}${initialData.image}`;
        }
        return initialData.image;
    };
    
    const [imagePreview, setImagePreview] = useState<string | null>(getInitialImagePreview());

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
            const token = localStorage.getItem('adminToken');
            
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('category', data.category);
            formData.append('downloadUrl', data.downloadUrl);
            
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    // Don't set Content-Type for FormData - axios will set it automatically with boundary
                },
            };

            let response;
            if (isEdit) {
                response = await axios.put(`${apiUrl}/api/books/${initialData._id}`, formData, config);
            } else {
                response = await axios.post(`${apiUrl}/api/books`, formData, config);
            }
            
            console.log('Book saved successfully:', response.data);
            
            // Show success message
            if (response.data?.message) {
                alert(response.data.message);
            }
            
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Error saving book:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Kitobni saqlashda xatolik yuz berdi';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white border border-gray-200 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700">Sarlavha</label>
                <input
                    {...register('title', { required: 'Sarlavha kiritilishi shart' })}
                    className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Kategoriya</label>
                <input
                    {...register('category', { required: 'Kategoriya kiritilishi shart' })}
                    className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rasm</label>
                
                {imagePreview ? (
                    <div className="relative mb-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">Rasm faylini tanlang</p>
                    </div>
                )}

                <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                        {selectedImage ? selectedImage.name : 'Rasm faylini tanlash'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!isEdit}
                    />
                </label>
                {!isEdit && !selectedImage && (
                    <p className="text-red-500 text-sm mt-1">Rasm fayli tanlanishi shart</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Yuklab olish URL</label>
                <input
                    {...register('downloadUrl', { required: 'Yuklab olish URL kiritilishi shart' })}
                    className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-gray-900"
                />
                {errors.downloadUrl && <p className="text-red-500 text-sm mt-1">{errors.downloadUrl.message as string}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 font-bold text-white bg-[#0056b3] rounded-lg hover:bg-[#004494] transition-colors shadow-lg shadow-[#0056b3]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Saqlanmoqda...' : (isEdit ? 'Kitobni Yangilash' : 'Kitob Qo\'shish')}
            </button>
        </form>
    );
}
