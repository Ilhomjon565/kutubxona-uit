import axios from 'axios';
import { 
  User, 
  Book, 
  Category, 
  LoginRequest, 
  RegisterRequest, 
  UpdateProfileRequest,
  CreateBookRequest,
  UpdateBookRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types';

const API_BASE_URL = 'https://api.kutubxona.uit.uz/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Faqat login sahifasida emas bo'lsa, token'ni tozalash
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<{ message: string; user: User; token: string }> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Books API
export const booksApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<{ message: string; books: Book[] }> => {
    const response = await api.get('/books', { params });
    // Backend returns array directly, we need to wrap it
    if (Array.isArray(response.data)) {
      return { message: 'Kitoblar muvaffaqiyatli olingan', books: response.data };
    }
    return response.data;
  },

  getById: async (id: string): Promise<{ message: string; book: Book }> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (data: CreateBookRequest | FormData): Promise<{ message: string; book: Book }> => {
    const response = await api.post('/books', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateBookRequest | FormData): Promise<{ message: string; book: Book }> => {
    const response = await api.put(`/books/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<{ message: string; categories: Category[] }> => {
    const response = await api.get('/category');
    return response.data;
  },

  getById: async (id: string): Promise<{ message: string; category: Category }> => {
    const response = await api.get(`/category/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<{ message: string; category: Category }> => {
    const response = await api.post('/category', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryRequest): Promise<{ message: string; category: Category }> => {
    const response = await api.put(`/category/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },
};

export default api;
