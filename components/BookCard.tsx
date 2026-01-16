'use client';

import axios from 'axios';
import { Download, Eye, BookOpen } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, memo, useCallback } from 'react';
import Link from 'next/link';

interface Book {
    _id: string;
    title: string;
    category: string;
    image: string;
    downloadUrl: string;
    views: number;
    downloads: number;
}

const BookCard = memo(function BookCard({ book }: { book: Book }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 80 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 80 });
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const getImageUrl = useCallback(() => {
        if (book.image.startsWith('http')) {
            return book.image;
        } else if (book.image.startsWith('/uploads')) {
            return `${apiUrl}${book.image}`;
        }
        return book.image;
    }, [book.image, apiUrl]);

    const handleDownload = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/books/${book._id}/download`);
            window.open(book.downloadUrl, '_blank');
        } catch (error) {
            console.error('Error tracking download:', error);
            window.open(book.downloadUrl, '_blank');
        }
    }, [book._id, book.downloadUrl, apiUrl]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <Link href={`/books/${book._id}`}>
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100/50 cursor-pointer perspective-1000"
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />
            
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0056b3] via-[#00a8ff] to-[#0056b3] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />

            {/* Image Container with Parallax */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {!imageError ? (
                    <img
                        src={getImageUrl()}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
                        style={{
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onError={(e) => {
                            setImageError(true);
                            (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0056b3]/10 to-[#00a8ff]/10">
                        <div className="p-4 bg-white/80 rounded-full mb-3">
                            <BookOpen className="w-12 h-12 text-[#0056b3]" />
                        </div>
                        <p className="text-xs text-gray-500 text-center px-4">Rasm yuklanmadi</p>
                    </div>
                )}
                
                {/* Animated Gradient Overlay */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.3 }}
                    transition={{ duration: 0.4 }}
                />


                {/* Category Badge with Animation */}
                <motion.div 
                    className="absolute top-3 left-3 z-20"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.span 
                        className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-[#0056b3] to-[#00a8ff] backdrop-blur-md rounded-full uppercase tracking-wider shadow-lg"
                        whileHover={{ scale: 1.1 }}
                    >
                        {book.category}
                    </motion.span>
                </motion.div>

                {/* Quick Action Buttons with Stagger Animation */}
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center gap-4 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload(e);
                        }}
                        className="p-4 bg-white text-[#0056b3] rounded-full shadow-2xl"
                        whileHover={{ scale: 1.15, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Download className="w-6 h-6" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Content Section with 3D Effect */}
            <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50" style={{ transform: "translateZ(20px)" }}>
                <motion.h3 
                    className="text-ellipsis-2 font-bold text-gray-900 mb-3 leading-tight"
                    style={{
                        fontSize: 'clamp(0.7rem, 2vw, 0.875rem)',
                        minHeight: '2.5em',
                    }}
                    animate={{ color: isHovered ? '#0056b3' : '#111827' }}
                    transition={{ duration: 0.3 }}
                >
                    {book.title}
                </motion.h3>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold"
                            whileHover={{ scale: 1.1, color: '#00a8ff' }}
                        >
                            <Eye className="w-4 h-4 text-[#00a8ff]" />
                            <span>{book.views}</span>
                        </motion.div>
                        <motion.div 
                            className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold"
                            whileHover={{ scale: 1.1, color: '#0056b3' }}
                        >
                            <Download className="w-4 h-4 text-[#0056b3]" />
                            <span>{book.downloads}</span>
                        </motion.div>
                    </div>
                    <motion.div
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <BookOpen className="w-5 h-5 text-gray-300" />
                    </motion.div>
                </div>
            </div>

            {/* Decorative Corner Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#0056b3]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
        </Link>
    );
});

export default BookCard;
