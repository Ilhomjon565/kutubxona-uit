export interface User {
  _id: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Book {
  _id: string;
  title: string;
  image: string;
  downloadLink: string;
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface CreateBookRequest {
  title: string;
  downloadLink: string;
  category: string;
  description: string;
  image?: File;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  image?: File;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
