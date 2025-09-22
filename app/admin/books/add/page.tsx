"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Loader2, BookOpen } from "lucide-react"
import { AdminBreadcrumb } from "@/components/breadcrumb"
import { createBook, getCategories } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { bookSchema, type BookFormData } from "@/lib/validations"
import { z } from "zod"
import type { Category } from "@/lib/api"

export default function AddBookPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [downloadLink, setDownloadLink] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Partial<BookFormData>>({})
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching categories:", err)
      setCategories([])
      setError(err instanceof Error ? err.message : "Kategoriyalarni yuklashda xatolik")
    }
  }

  const validateForm = (): boolean => {
    try {
      const formData: BookFormData = {
        title,
        description,
        category,
        downloadLink,
        image
      }
      
      bookSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<BookFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof BookFormData] = err.message
          }
        })
        setFormErrors(errors)
      }
      return false
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak")
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Faqat rasm fayllari qabul qilinadi")
        return
      }
      
      setImage(file)
      setError("")
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
    setFormErrors({})
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      await createBook(
        {
          title,
          description,
          category,
          downloadLink,
          image: image || "",
        },
        token,
      )

      router.push("/admin/books")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kitob qo'shishda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
        {/* Breadcrumb */}
        <div>
          <AdminBreadcrumb items={[
            { label: "Kitoblar", href: "/admin/books" },
            { label: "Yangi Kitob Qo'shish" }
          ]} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="/admin/books">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Yangi Kitob Qo'shish</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kutubxonaga yangi kitob qo'shing
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1 bg-primary/10 rounded">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              Kitob Ma'lumotlari
            </CardTitle>
            <CardDescription className="text-sm">
              Kitob haqida to'liq ma'lumot kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Kitob Nomi *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Kitob nomini kiriting"
                      required
                      disabled={isLoading}
                      className={`h-11 mt-1 ${formErrors.title ? 'border-destructive' : ''}`}
                    />
                    {formErrors.title && (
                      <p className="text-sm text-destructive mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Kategoriya *</Label>
                    <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                      <SelectTrigger className={`h-11 mt-1 ${formErrors.category ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(categories) && categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-sm text-destructive mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="downloadLink" className="text-sm font-medium">Yuklab Olish Havolasi *</Label>
                    <Input
                      id="downloadLink"
                      type="url"
                      value={downloadLink}
                      onChange={(e) => setDownloadLink(e.target.value)}
                      placeholder="https://example.com/book.pdf"
                      required
                      disabled={isLoading}
                      className={`h-11 mt-1 ${formErrors.downloadLink ? 'border-destructive' : ''}`}
                    />
                    {formErrors.downloadLink && (
                      <p className="text-sm text-destructive mt-1">{formErrors.downloadLink}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">Kitob Muqovasi</Label>
                    <div className="mt-1">
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
                            src={imagePreview || "/placeholder.svg"}
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
                <Label htmlFor="description" className="text-sm font-medium">Tavsif *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kitob haqida qisqacha ma'lumot"
                  rows={4}
                  required
                  disabled={isLoading}
                  className={`mt-1 ${formErrors.description ? 'border-destructive' : ''}`}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="h-11">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Qo'shilmoqda...
                    </>
                  ) : (
                    "Kitob Qo'shish"
                  )}
                </Button>
                <Link href="/admin/books">
                  <Button type="button" variant="outline" disabled={isLoading} className="h-11 w-full sm:w-auto">
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
