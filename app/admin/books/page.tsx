"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Plus, Search, Edit, Trash2, Download, Loader2 } from "lucide-react"
import { BookListSkeleton } from "@/components/loading-spinner"
import { AdminBreadcrumb } from "@/components/breadcrumb"
import { getBooks, deleteBook } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Book } from "@/lib/api"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBooks(filtered)
  }, [books, searchTerm])

  const fetchBooks = async () => {
    try {
      const data = await getBooks()
      setBooks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching books:", err)
      setBooks([])
      setError(err instanceof Error ? err.message : "Kitoblarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Kitobni o'chirishni xohlaysizmi?")) return

    setDeletingId(id)
    setError("")

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      await deleteBook(id, token)
      setBooks(books.filter((book) => book.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kitobni o'chirishda xatolik")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
        {/* Breadcrumb */}
        <div>
          <AdminBreadcrumb items={[{ label: "Kitoblar" }]} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Kitoblar</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kutubxonadagi barcha kitoblarni boshqaring
            </p>
          </div>
          <Link href="/admin/books/add">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Yangi Kitob
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1 bg-primary/10 rounded">
                <Search className="h-4 w-4 text-primary" />
              </div>
              Qidiruv
            </CardTitle>
            <CardDescription className="text-sm">
              Kitob nomi, kategoriya yoki tavsif bo'yicha qidiring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kitoblarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Books List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-lg">
                <div className="p-1 bg-primary/10 rounded">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Kitoblar Ro'yxati
              </span>
              <Badge variant="secondary" className="text-xs">{filteredBooks.length} ta kitob</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <BookListSkeleton />
            ) : filteredBooks.length > 0 ? (
              <div className="space-y-4">
                {Array.isArray(filteredBooks) && filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      {book.image ? (
                        <img
                          src={`https://api.kutubxona.uit.uz/${book.image}` || "/placeholder.svg"}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-muted rounded border flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{book.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{book.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
                      {book.downloadLink && (
                        <a
                          href={book.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                        >
                          <Download className="h-3 w-3" />
                          Yuklab olish
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/admin/books/edit/${book.id}`}>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Tahrirlash</span>
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBook(book.id)}
                        disabled={deletingId === book.id}
                        className="flex-1 sm:flex-none"
                      >
                        {deletingId === book.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline ml-1">O'chirish</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {searchTerm ? "Kitob topilmadi" : "Kitoblar yo'q"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? "Boshqa kalit so'z bilan qidiring" : "Birinchi kitobni qo'shing"}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Link href="/admin/books/add">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Kitob Qo'shish
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
