'use client';

import React, { useState } from 'react';
import { Book } from '@/types';
import { X, Calendar, User, BookOpen, ExternalLink, Download, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import PDFReader from './PDFReader';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  if (!isOpen || !book) return null;

  const handleDownload = () => {
    if (book.downloadLink) {
      window.open(book.downloadLink, '_blank');
    }
  };

  const handleReadOnline = () => {
    if (book.downloadLink) {
      window.open(book.downloadLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {book.title}
              </h3>
              <div className="flex items-center text-lg text-gray-600 mb-4">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{book.category}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                {book.image ? (
                  <img
                    src={`https://api.kutubxona.uit.uz/${book.image}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Rasm yo'q</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center space-x-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {book.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tavsif</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Book Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span className="font-medium">Kategoriya:</span>
                    <span className="ml-2">{book.category}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">Yaratilgan:</span>
                    <span className="ml-2">{book.createdAt ? new Date(book.createdAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}</span>
                  </div>
                </div>

                {/* Actions */}
                {book.downloadLink && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      onClick={handleReadOnline}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Onlayn o'qish
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Yuklab olish
                    </button>
                  </div>
                )}

                {!book.downloadLink && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-yellow-800 text-sm">
                      Bu kitob uchun yuklab olish havolasi mavjud emas. Kitobni jismoniy ko'rinishda kutubxonadan olishingiz mumkin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
