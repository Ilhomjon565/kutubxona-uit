"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Loader2, Tag, Trash2 } from "lucide-react"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Category } from "@/lib/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsCreating(true)
    setError("")

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      const newCategory = await createCategory(newCategoryName.trim(), token)
      setCategories([...categories, newCategory])
      setNewCategoryName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategoriya yaratishda xatolik")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditCategory = async (id: string) => {
    if (!editingName.trim()) return

    setError("")

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      const updatedCategory = await updateCategory(id, editingName.trim(), token)
      setCategories(Array.isArray(categories) ? categories.map((cat) => (cat.id === id ? updatedCategory : cat)) : [])
      setEditingId(null)
      setEditingName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategoriyani yangilashda xatolik")
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyani o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.")) {
      return
    }

    setError("")

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      await deleteCategory(id, token)
      setCategories(Array.isArray(categories) ? categories.filter((cat) => cat.id !== id) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategoriyani o'chirishda xatolik")
    }
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kategoriyalar</h1>
          <p className="text-muted-foreground">Kitob kategoriyalarini boshqaring</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Yangi Kategoriya Qo'shish
            </CardTitle>
            <CardDescription>Kitoblar uchun yangi kategoriya yarating</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCategory} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="categoryName" className="sr-only">
                  Kategoriya nomi
                </Label>
                <Input
                  id="categoryName"
                  placeholder="Kategoriya nomini kiriting"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <Button type="submit" disabled={isCreating || !newCategoryName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Qo'shilmoqda...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Qo'shish
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Mavjud Kategoriyalar
            </CardTitle>
            <CardDescription>Barcha kategoriyalar ro'yxati</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-4">
                {Array.isArray(categories) && categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {editingId === category.id ? (
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-6 text-xs border-none p-0 bg-transparent"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditCategory(category.id)
                              } else if (e.key === "Escape") {
                                cancelEditing()
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          category.name
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingId === category.id ? (
                        <>
                          <Button size="sm" onClick={() => handleEditCategory(category.id)}>
                            Saqlash
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            Bekor qilish
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEditing(category)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Tahrirlash
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="hover:bg-destructive/90"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            O'chirish
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">Kategoriyalar yo'q</h3>
                <p className="mt-1 text-sm text-muted-foreground">Birinchi kategoriyani qo'shing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
