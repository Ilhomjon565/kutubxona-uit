"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Tag, ArrowRight } from "lucide-react"
import { getBooks, getCategories } from "@/lib/api"
import { Breadcrumb } from "@/components/breadcrumb"
import type { Book, Category } from "@/lib/api"

export default function CategoriesPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()])
      setBooks(booksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryBookCount = (categoryName: string) => {
    return books.filter((book) => book.category === categoryName).length
  }

  const getPopularCategories = () => {
    const categoryCounts = categories.map((category) => ({
      ...category,
      bookCount: getCategoryBookCount(category.name),
    }))
    return categoryCounts.sort((a, b) => b.bookCount - a.bookCount)
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Kitoblar", href: "/books" },
            { label: "Kategoriyalar" }
          ]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            Kitob Kategoriyalari
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Qiziqish sohangizdagi kitoblarni toping. Har bir kategoriyada mavjud kitoblar soni ko'rsatilgan.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami Kategoriyalar</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : categories.length}</div>
              <p className="text-xs text-muted-foreground">Mavjud kategoriyalar soni</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami Kitoblar</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : books.length}</div>
              <p className="text-xs text-muted-foreground">Barcha kategoriyalardagi kitoblar</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eng Ko'p Kitobli</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : getPopularCategories()[0]
                    ? getCategoryBookCount(getPopularCategories()[0].name)
                    : 0}
              </div>
              <p className="text-xs text-muted-foreground">{getPopularCategories()[0]?.name || "Kategoriya yo'q"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-32">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {getPopularCategories().map((category) => {
              const bookCount = category.bookCount
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-base">
                        <div className="p-1 bg-primary/10 rounded">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">{bookCount} kitob</Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {bookCount > 0
                        ? `Bu kategoriyada ${bookCount} ta kitob mavjud`
                        : "Bu kategoriyada hozircha kitoblar yo'q"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link href={`/books?category=${encodeURIComponent(category.name)}`}>
                      <Button className="w-full h-10" disabled={bookCount === 0}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {bookCount > 0 ? "Kitoblarni Ko'rish" : "Kitoblar Yo'q"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Kategoriyalar yo'q</h3>
            <p className="mt-2 text-muted-foreground">Hozircha kategoriyalar yaratilmagan.</p>
            <div className="mt-6">
              <Link href="/books">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Barcha Kitoblarni Ko'rish
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
