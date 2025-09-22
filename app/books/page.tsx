"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Search, Download, Filter } from "lucide-react"
import { getBooks, getCategories } from "@/lib/api"
import { BookCardSkeleton } from "@/components/loading-spinner"
import { Breadcrumb } from "@/components/breadcrumb"
import type { Book, Category } from "@/lib/api"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = Array.isArray(books) ? books : []

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()])
      setBooks(Array.isArray(booksData) ? booksData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setError("")
    } catch (err) {
      console.error("Error fetching data:", err)
      setBooks([])
      setCategories([])
      setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError("")
    fetchData()
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Kitoblar Katalogi" }]} />
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4 leading-tight animate-slide-up">
              Kitoblar Katalogi
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Universitetimizning boy kutubxona fondidan kerakli kitoblarni toping va yuklab oling
            </p>
          </div>

          <Card className="shadow-sm bg-white hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1 bg-primary/10 rounded">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                Qidiruv va Filtr
              </CardTitle>
              <CardDescription className="text-sm">
                Kitoblarni nom, tavsif yoki kategoriya bo'yicha qidiring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Kitob nomi, muallif yoki mavzu bo'yicha qidiring..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 text-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Kategoriya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha Kategoriyalar</SelectItem>
                      {Array.isArray(categories) && categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {Array.isArray(categories) && categories.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Tezkor filtr:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className="text-xs"
                    >
                      Barchasi
                    </Button>
                    {Array.isArray(categories) && categories.slice(0, 4).map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.name)}
                        className="text-xs"
                      >
                        {category.name}
                      </Button>
                    ))}
                    {Array.isArray(categories) && categories.length > 4 && (
                      <Link href="/books/categories">
                        <Button variant="ghost" size="sm" className="text-xs">
                          +{categories.length - 4} ko'proq
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Qayta urinish
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {isLoading ? "Yuklanmoqda..." : `${Array.isArray(filteredBooks) ? filteredBooks.length : 0} ta kitob topildi`}
              {selectedCategory !== "all" && ` "${selectedCategory}" kategoriyasida`}
            </span>
          </div>
          {(searchTerm || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
            >
              Filtrni tozalash
            </Button>
          )}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(filteredBooks) && filteredBooks.map((book, index) => (
              <Card key={book.id} className="group hover-lift hover-glow bg-white animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg group-hover:rounded-xl transition-all duration-300">
                  {book.image ? (
                    <img
                      src={`https://api.kutubxona.uit.uz/${book.image}` || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                      <BookOpen className="h-12 w-12 text-primary animate-bounce-gentle" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors duration-300">{book.title}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all duration-300">
                      {book.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{book.description}</p>
                  </div>
                  <div className="mt-4">
                    {book.downloadLink ? (
                      <a href={book.downloadLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button size="sm" className="w-full h-9 text-xs font-medium bg-primary hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <Download className="h-3 w-3 mr-2" />
                          Yuklab Olish
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" className="w-full h-9 text-xs" disabled>
                        Mavjud Emas
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {searchTerm || selectedCategory !== "all" ? "Kitob topilmadi" : "Kitoblar yo'q"}
            </h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {searchTerm || selectedCategory !== "all"
                ? "Qidiruv shartlaringizga mos kitob topilmadi. Boshqa kalit so'zlar bilan qidiring yoki filtrni o'zgartiring."
                : "Hozircha kutubxonada kitoblar mavjud emas."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                >
                  Barcha kitoblarni ko'rish
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
