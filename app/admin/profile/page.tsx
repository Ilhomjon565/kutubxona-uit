"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Save, Loader2 } from "lucide-react"
import { getProfile, updateProfile } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Profile } from "@/lib/api"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      const profileData = await getProfile(token)
      setProfile(profileData)
      setFormData({
        username: profileData.username,
        email: profileData.email || "",
        fullName: profileData.fullName || "",
      })
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "Profil ma'lumotlarini yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const token = getToken()
      if (!token) throw new Error("Token topilmadi")

      const updatedProfile = await updateProfile(formData, token)
      setProfile(updatedProfile)
      setSuccess("Profil muvaffaqiyatli yangilandi")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profilni yangilashda xatolik")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profil</h1>
          <p className="text-muted-foreground">Shaxsiy ma'lumotlaringizni boshqaring</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Shaxsiy Ma'lumotlar
            </CardTitle>
            <CardDescription>
              Profil ma'lumotlaringizni yangilang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Foydalanuvchi nomi</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">To'liq ism</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                  disabled={isSaving}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Saqlash
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Profile Info */}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Profil Ma'lumotlari</CardTitle>
              <CardDescription>
                Joriy profil ma'lumotlari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Foydalanuvchi ID</Label>
                  <p className="text-sm">{profile.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                  <p className="text-sm">{profile.role || "Admin"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Foydalanuvchi nomi</Label>
                  <p className="text-sm">{profile.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{profile.email || "Kiritilmagan"}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">To'liq ism</Label>
                  <p className="text-sm">{profile.fullName || "Kiritilmagan"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  )
}
