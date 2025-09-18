'use client';

import React from 'react';
import { Book } from '@/types';
import { BookOpen, Calendar, User, Eye } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        {book.image ? (
          <img
            src={`https://api.kutubxona.uit.uz/${book.image}`}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Rasm yo'q</p>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {book.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="truncate">{book.category}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {truncateText(book.description, 100)}
        </p>

        <div className="flex space-x-2">
          <button
            onClick={() => onView?.(book)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ko'rish
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
