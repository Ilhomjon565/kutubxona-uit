'use client';

import axios from 'axios';
import { Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface Book {
    _id: string;
    title: string;
    category: string;
    image: string;
    downloadUrl: string;
    views: number;
    downloads: number;
}

export default function BookCard({ book }: { book: Book }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
    
    // Get image URL - if it starts with /uploads, prepend API URL
    const getImageUrl = () => {
        if (book.image.startsWith('http')) {
            return book.image;
        } else if (book.image.startsWith('/uploads')) {
            return `${apiUrl}${book.image}`;
        }
        return book.image;
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axios.post(`${apiUrl}/api/books/${book._id}/download`);
            window.open(book.downloadUrl, '_blank');
        } catch (error) {
            console.error('Error tracking download:', error);
            window.open(book.downloadUrl, '_blank');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
        >
            {/* Background Image */}
            <img
                src={getImageUrl()}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0056b3]/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-white bg-[#0056b3] rounded-full">
                        {book.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">{book.title}</h3>

                    <div className="flex items-center justify-between mt-3 text-white/90 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" /> {book.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <Download className="w-4 h-4" /> {book.downloads}
                            </span>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="p-2 bg-white text-[#0056b3] rounded-full hover:bg-gray-100 transition-colors"
                            title="Yuklab olish"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
