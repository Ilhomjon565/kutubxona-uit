"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Xatolik yuz berdi</CardTitle>
          <CardDescription>Kutilmagan xatolik yuz berdi. Sahifani yangilashga harakat qiling.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Qayta Urinish
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Bosh Sahifaga Qaytish
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
