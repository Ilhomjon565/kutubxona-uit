"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Loader2, BookOpen } from "lucide-react"
import { getBooks, updateBook, getCategories } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Book, Category } from "@/lib/api"

export default function EditBookPage() {
  const [book, setBook] = useState<Book | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [downloadLink, setDownloadLink] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBook, setIsLoadingBook] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  useEffect(() => {
    fetchBookAndCategories()
  }, [bookId])

  const fetchBookAndCategories = async () => {
    try {
      const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()])

      const foundBook = booksData.find((b) => b.id === bookId)
      if (!foundBook) {
        setError("Kitob topilmadi")
        return
      }

      setBook(foundBook)
      setTitle(foundBook.title)
      setDescription(foundBook.description)
      setCategory(foundBook.category)
      setDownloadLink(foundBook.downloadLink)
      setImagePreview(foundBook.image)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik")
    } finally {
      setIsLoadingBook(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      await updateBook(
        bookId,
        {
          title,
          description,
          category,
          downloadLink,
          ...(image && { image }),
        },
        token,
      )

      router.push("/admin/books")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kitobni yangilashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingBook) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Kitob ma'lumotlari yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Kitob topilmadi</h3>
        <p className="mt-1 text-sm text-muted-foreground">Ushbu kitob mavjud emas yoki o'chirilgan</p>
        <div className="mt-6">
          <Link href="/admin/books">
            <Button>Kitoblar ro'yxatiga qaytish</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/books">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kitobni Tahrirlash</h1>
            <p className="text-muted-foreground">"{book.title}" kitobini yangilang</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Kitob Ma'lumotlari
            </CardTitle>
            <CardDescription>Kitob ma'lumotlarini yangilang</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Kitob Nomi *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Kitob nomini kiriting"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategoriya *</Label>
                    <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="downloadLink">Yuklab Olish Havolasi *</Label>
                    <Input
                      id="downloadLink"
                      type="url"
                      value={downloadLink}
                      onChange={(e) => setDownloadLink(e.target.value)}
                      placeholder="https://example.com/book.pdf"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image">Kitob Muqovasi</Label>
                    <div className="mt-2">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {imagePreview ? (
                          <img
                            src={`https://api.kutubxona.uit.uz${imagePreview}` || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="mt-2 text-sm text-muted-foreground">Rasm yuklash</span>
                          </div>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Tavsif *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kitob haqida qisqacha ma'lumot"
                  rows={4}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Yangilanmoqda...
                    </>
                  ) : (
                    "O'zgarishlarni Saqlash"
                  )}
                </Button>
                <Link href="/admin/books">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Bekor Qilish
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
