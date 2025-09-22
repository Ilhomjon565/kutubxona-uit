"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, Loader2, Users } from "lucide-react"
import { loginAdmin } from "@/lib/api"
import { setToken } from "@/lib/auth"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { z } from "zod"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({})
  const router = useRouter()

  const validateForm = (): boolean => {
    try {
      const formData: LoginFormData = {
        username,
        password
      }
      
      loginSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<LoginFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof LoginFormData] = err.message
          }
        })
        setFormErrors(errors)
      }
      return false
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
      const response = await loginAdmin(username, password)
      setToken(response.token)
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bosh sahifaga qaytish
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
            <CardDescription className="text-sm">
              Kutubxonani boshqarish uchun tizimga kiring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Foydalanuvchi nomi
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Foydalanuvchi nomini kiriting"
                  required
                  disabled={isLoading}
                  className={`h-11 ${formErrors.username ? 'border-destructive' : ''}`}
                />
                {formErrors.username && (
                  <p className="text-sm text-destructive">{formErrors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Parol
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolni kiriting"
                    required
                    disabled={isLoading}
                    className={`h-11 pr-10 ${formErrors.password ? 'border-destructive' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kirish...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Innovatsion Texnologiyalar Universiteti</p>
          <p>Kutubxona Boshqaruv Tizimi</p>
        </div>
      </div>
    </div>
  )
}