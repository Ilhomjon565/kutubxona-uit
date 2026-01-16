'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, BookOpen, Calendar, User, Tag, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Metadata } from 'next';

interface Book {
  _id: string;
  title: string;
  category: string;
  image: string;
  downloadUrl: string;
  views: number;
  downloads: number;
  author?: string;
  description?: string;
  publishedDate?: string;
  isbn?: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

  useEffect(() => {
    if (params.id) {
      fetchBook();
      trackView();
    }
  }, [params.id]);

  const fetchBook = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/books/${params.id}`);
      setBook(data);
      
      // Fetch related books
      const allBooks = await axios.get(`${apiUrl}/api/books`);
      const related = allBooks.data
        .filter((b: Book) => b._id !== data._id && b.category === data.category)
        .slice(0, 5);
      setRelatedBooks(related);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await axios.post(`${apiUrl}/api/books/${params.id}/view`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await axios.post(`${apiUrl}/api/books/${params.id}/download`);
      window.open(book?.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error tracking download:', error);
      if (book?.downloadUrl) {
        window.open(book.downloadUrl, '_blank');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: `${book.title} - UIT Kutubxona`,
          url: `${siteUrl}/books/${book._id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${siteUrl}/books/${book?._id}`);
      alert('Havola nusxalandi!');
    }
  };

  const getImageUrl = () => {
    if (!book) return '';
    if (book.image.startsWith('http')) {
      return book.image;
    } else if (book.image.startsWith('/uploads')) {
      return `${apiUrl}${book.image}`;
    }
    return book.image;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0056b3] mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kitob topilmadi</h1>
          <Link href="/books" className="text-[#0056b3] hover:underline">
            Barcha kitoblarga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": book.title,
            "image": getImageUrl(),
            "description": book.description || `${book.title} - ${book.category} kategoriyasidagi kitob`,
            "category": book.category,
            "author": book.author ? {
              "@type": "Person",
              "name": book.author
            } : undefined,
            "publisher": {
              "@type": "Organization",
              "name": "University of Innovation Technologies"
            },
            "isbn": book.isbn,
            "datePublished": book.publishedDate,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": book.downloads
            }
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-[#0056b3] hover:text-[#004494] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Orqaga</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left Column - Book Cover */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#0056b3]/20 to-[#00a8ff]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={getImageUrl()}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 flex items-center justify-center"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0056b3] to-[#00a8ff] text-white rounded-full text-sm font-bold shadow-lg">
                      <Tag className="w-4 h-4" />
                      {book.category}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Book Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                      {book.title}
                    </h1>
                    {book.author && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <User className="w-5 h-5 text-[#0056b3]" />
                        <span className="text-lg font-medium">{book.author}</span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-gray-100 hover:bg-[#0056b3] text-gray-600 hover:text-white rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-5 h-5 text-[#00a8ff]" />
                    <span className="font-semibold">{book.views.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">ko'rish</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Download className="w-5 h-5 text-[#0056b3]" />
                    <span className="font-semibold">{book.downloads.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">yuklab olish</span>
                  </div>
                  {book.publishedDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">{book.publishedDate}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              {book.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0056b3]" />
                    Tavsif
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </motion.div>
              )}

              {/* Download Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-[#0056b3] to-[#00a8ff] hover:from-[#004494] hover:to-[#0099e6] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#0056b3]/30 flex items-center justify-center gap-3 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span>Yuklab Olish</span>
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {book.isbn && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">ISBN</p>
                    <p className="font-semibold text-gray-900">{book.isbn}</p>
                  </div>
                )}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Kategoriya</p>
                  <p className="font-semibold text-gray-900">{book.category}</p>
                </div>
              </motion.div>

              {/* Related Books */}
              {relatedBooks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#0056b3]" />
                    O'xshash Kitoblar
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {relatedBooks.map((relatedBook) => (
                      <Link
                        key={relatedBook._id}
                        href={`/books/${relatedBook._id}`}
                        className="group"
                      >
                        <motion.div
                          whileHover={{ y: -5, scale: 1.05 }}
                          className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-[#0056b3] transition-all"
                        >
                          <img
                            src={relatedBook.image.startsWith('http') ? relatedBook.image : `${apiUrl}${relatedBook.image}`}
                            alt={relatedBook.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white text-xs font-bold line-clamp-2">{relatedBook.title}</p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

