'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  category: string;
  image: string;
  downloadUrl: string;
  views: number;
  downloads: number;
  createdAt?: string;
}

export function useBookNotifications() {
  const [lastBookId, setLastBookId] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasRequestedPermission = useRef(false);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && !hasRequestedPermission.current) {
      hasRequestedPermission.current = true;
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  // Initialize last book ID
  useEffect(() => {
    const initializeLastBook = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
        const { data } = await axios.get(`${apiUrl}/api/books?limit=1&page=1`);
        const books = Array.isArray(data) ? data : (data.books || []);
        if (books.length > 0) {
          setLastBookId(books[0]._id);
        }
      } catch (error) {
        console.error('Error initializing last book:', error);
      }
    };

    initializeLastBook();
  }, []);

  // Check for new books periodically
  useEffect(() => {
    if (notificationPermission !== 'granted' || !lastBookId) {
      return;
    }

    const checkForNewBooks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
        const { data } = await axios.get(`${apiUrl}/api/books?limit=1&page=1`);
        const books = Array.isArray(data) ? data : (data.books || []);
        
        if (books.length > 0) {
          const latestBook = books[0] as Book;
          
          // Check if this is a new book
          if (latestBook._id !== lastBookId) {
            setLastBookId(latestBook._id);
            showNotification(latestBook);
          }
        }
      } catch (error) {
        console.error('Error checking for new books:', error);
      }
    };

    // Check every 60 seconds (1 minute) for new books
    intervalRef.current = setInterval(checkForNewBooks, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [notificationPermission, lastBookId]);

  const showNotification = (book: Book) => {
    if (Notification.permission !== 'granted') {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';
    let imageUrl = '/logo.png'; // Default fallback
    
    // Try to get book image
    if (book.image) {
      if (book.image.startsWith('http')) {
        imageUrl = book.image;
      } else if (book.image.startsWith('/uploads')) {
        imageUrl = `${apiUrl}${book.image}`;
      } else {
        imageUrl = book.image;
      }
    }

    // Create notification with fallback for image
    const notificationOptions: NotificationOptions = {
      body: `${book.title}\n📂 ${book.category}`,
      icon: imageUrl,
      badge: '/logo.png',
      tag: `book-${book._id}`,
      requireInteraction: false,
      silent: false,
      data: {
        url: `/books/${book._id}`,
        bookId: book._id,
      },
    };

    // Add image if supported (some browsers support image property)
    if ('image' in Notification.prototype) {
      (notificationOptions as any).image = imageUrl;
    }

    const notification = new Notification('📚 Yangi Kitob Qo\'shildi!', notificationOptions);

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      const url = (notification as any).data?.url || `/books/${book._id}`;
      window.location.href = url;
      notification.close();
    };

    // Auto close after 8 seconds
    setTimeout(() => {
      notification.close();
    }, 8000);
  };

  return {
    notificationPermission,
    requestPermission: () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    },
  };
}

