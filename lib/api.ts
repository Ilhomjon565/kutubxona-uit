const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kutubxona.uit.uz"

export interface Book {
  id: string
  title: string
  image: string
  downloadLink: string
  category: string
  description: string
}

export interface Category {
  id: string
  name: string
}

export interface LoginResponse {
  message: string
  user: {
    id: string
    username: string
  }
  token: string
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Noma'lum xatolik yuz berdi"

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      // If JSON parsing fails, use status-based messages
      switch (response.status) {
        case 400:
          errorMessage = "Noto'g'ri so'rov ma'lumotlari"
          break
        case 401:
          errorMessage = "Avtorizatsiya talab qilinadi"
          break
        case 403:
          errorMessage = "Ruxsat berilmagan"
          break
        case 404:
          errorMessage = "Ma'lumot topilmadi"
          break
        case 500:
          errorMessage = "Server xatoligi"
          break
        default:
          errorMessage = `Xatolik: ${response.status}`
      }
    }

    throw new ApiError(errorMessage, response.status)
  }

  try {
    return await response.json()
  } catch {
    throw new ApiError("Javobni o'qishda xatolik")
  }
}

// Auth functions
export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    return await handleResponse<LoginResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Tarmoq xatoligi: Serverga ulanib bo'lmadi")
  }
}

// Book functions
export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    const data = await handleResponse<any[]>(response)
    
    // Transform API response to match our interface
    return data?.map((book: any) => ({
      id: book._id,
      title: book.title,
      image: book.image,
      downloadLink: book.downloadLink,
      category: book.category,
      description: book.description
    })) || []
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kitoblarni yuklashda tarmoq xatoligi")
  }
}

export async function createBook(book: Omit<Book, "id">, token: string): Promise<Book> {
  try {
    const formData = new FormData()
    formData.append("title", book.title)
    formData.append("downloadLink", book.downloadLink)
    formData.append("category", book.category)
    formData.append("description", book.description)

    // Handle image upload if it's a File
    if (book.image) {
      formData.append("image", book.image as string | File)
    }

    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await handleResponse<{book: any}>(response)
    
    // Transform API response to match our interface
    return {
      id: data.book._id,
      title: data.book.title,
      image: data.book.image,
      downloadLink: data.book.downloadLink,
      category: data.book.category,
      description: data.book.description
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kitob qo'shishda tarmoq xatoligi")
  }
}

export async function updateBook(id: string, book: Partial<Book>, token: string): Promise<Book> {
  try {
    const formData = new FormData()

    if (book.title) formData.append("title", book.title)
    if (book.downloadLink) formData.append("downloadLink", book.downloadLink)
    if (book.category) formData.append("category", book.category)
    if (book.description) formData.append("description", book.description)

    if (book.image) {
      formData.append("image", book.image as string | File)
    }

    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    return await handleResponse<Book>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kitobni yangilashda tarmoq xatoligi")
  }
}

export async function deleteBook(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    await handleResponse<void>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kitobni o'chirishda tarmoq xatoligi")
  }
}

// Category functions
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    const data = await handleResponse<{categories: any[]}>(response)
    
    // Transform API response to match our interface
    return data.categories?.map((cat: any) => ({
      id: cat._id,
      name: cat.name
    })) || []
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kategoriyalarni yuklashda tarmoq xatoligi")
  }
}

export async function createCategory(name: string, token: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })

    const data = await handleResponse<{category: any}>(response)
    
    // Transform API response to match our interface
    return {
      id: data.category._id,
      name: data.category.name
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kategoriya yaratishda tarmoq xatoligi")
  }
}

export async function updateCategory(id: string, name: string, token: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })

    const data = await handleResponse<{category: any}>(response)
    
    // Transform API response to match our interface
    return {
      id: data.category._id,
      name: data.category.name
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kategoriyani yangilashda tarmoq xatoligi")
  }
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    await handleResponse(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Kategoriyani o'chirishda tarmoq xatoligi")
  }
}

// Profile functions
export interface Profile {
  id: string
  username: string
  email?: string
  fullName?: string
  role?: string
}

export async function getProfile(token: string): Promise<Profile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Agar profil topilmasa, default ma'lumotlar qaytarish
        return {
          id: "default",
          username: "admin",
          email: "",
          fullName: "Administrator",
          role: "admin"
        }
      }
      throw new ApiError("Profil ma'lumotlari topilmadi", response.status)
    }

    const data = await handleResponse<{user: any}>(response)
    
    return {
      id: data.user?._id || "default",
      username: data.user?.username || "admin",
      email: data.user?.email || "",
      fullName: data.user?.fullName || "Administrator",
      role: data.user?.role || "admin"
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Xatolik yuz bersa, default ma'lumotlar qaytarish
    console.warn("Profile fetch failed, using default data:", error)
    return {
      id: "default",
      username: "admin",
      email: "",
      fullName: "Administrator",
      role: "admin"
    }
  }
}

export async function updateProfile(profile: Partial<Profile>, token: string): Promise<Profile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })

    const data = await handleResponse<{user: any}>(response)
    
    return {
      id: data.user._id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Profilni yangilashda tarmoq xatoligi")
  }
}
