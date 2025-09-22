"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Tag, Plus, TrendingUp, Users, Download } from "lucide-react"
import Link from "next/link"
import { CardSkeleton } from "@/components/loading-spinner"
import { AdminBreadcrumb } from "@/components/breadcrumb"
import { getBooks, getCategories } from "@/lib/api"
import type { Book, Category } from "@/lib/api"

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()])
        setBooks(Array.isArray(booksData) ? booksData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setBooks([])
        setCategories([])
        setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const recentBooks = Array.isArray(books) ? books.slice(0, 5) : []

  return (
    <div className="space-y-8">
        {/* Breadcrumb */}
        <div>
          <AdminBreadcrumb items={[{ label: "Dashboard" }]} />
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Kutubxona boshqaruv tizimi statistikasi
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami Kitoblar</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : books.length}</div>
              <p className="text-xs text-muted-foreground">Kutubxonadagi barcha kitoblar</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategoriyalar</CardTitle>
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
              <CardTitle className="text-sm font-medium">Faol Foydalanuvchilar</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Bu oyda faol</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yuklab Olishlar</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">Bu oyda yuklab olingan</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tezkor Amallar</CardTitle>
              <CardDescription className="text-sm">
                Kutubxonani boshqarish uchun tezkor havolalar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/books/add">
                <Button className="w-full justify-start h-10">
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi Kitob Qo'shish
                </Button>
              </Link>
              <Link href="/admin/books">
                <Button variant="outline" className="w-full justify-start bg-transparent h-10">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Barcha Kitoblarni Ko'rish
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start bg-transparent h-10">
                  <Tag className="mr-2 h-4 w-4" />
                  Kategoriyalarni Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">So'nggi Qo'shilgan Kitoblar</CardTitle>
              <CardDescription className="text-sm">
                Yaqinda qo'shilgan kitoblar ro'yxati
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : recentBooks.length > 0 ? (
                <div className="space-y-3">
                  {Array.isArray(recentBooks) && recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-8 bg-primary/10 rounded flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.category}</p>
                      </div>
                    </div>
                  ))}
                  {recentBooks.length === 5 && (
                    <Link href="/admin/books">
                      <Button variant="ghost" size="sm" className="w-full mt-2 h-8">
                        Barchasini ko'rish
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">Kitoblar yo'q</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Birinchi kitobni qo'shing</p>
                  <div className="mt-6">
                    <Link href="/admin/books/add">
                      <Button size="sm" className="h-8">
                        <Plus className="mr-2 h-4 w-4" />
                        Kitob Qo'shish
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1 bg-primary/10 rounded">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Faollik Ko'rsatkichlari
            </CardTitle>
            <CardDescription className="text-sm">
              Kutubxona foydalanish statistikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="text-2xl font-bold text-primary">89%</div>
                <div className="text-sm text-muted-foreground">Kitoblar mavjudligi</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="text-2xl font-bold text-secondary">156</div>
                <div className="text-sm text-muted-foreground">Bu hafta yuklab olishlar</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="text-2xl font-bold text-accent">23</div>
                <div className="text-sm text-muted-foreground">Yangi foydalanuvchilar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
