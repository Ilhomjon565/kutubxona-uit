"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { PageLoadingSpinner } from "@/components/loading-spinner"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Client-side da authentication tekshirish
        if (typeof window !== 'undefined') {
          const authenticated = isAuthenticated()
          setIsAuthed(authenticated)
          setIsLoading(false)

          if (!authenticated && pathname !== '/admin/login') {
            router.push("/admin/login")
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsLoading(false)
        if (pathname !== '/admin/login') {
          router.push("/admin/login")
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  // Login sahifasida guard ishlamasin
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoadingSpinner />
      </div>
    )
  }

  if (!isAuthed) {
    return null
  }

  return <>{children}</>
}
