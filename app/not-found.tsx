import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">404 - Sahifa Topilmadi</CardTitle>
          <CardDescription>Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Bosh Sahifaga Qaytish
            </Button>
          </Link>
          <Link href="/books">
            <Button variant="outline" className="w-full bg-transparent">
              <BookOpen className="mr-2 h-4 w-4" />
              Kitoblar Katalogi
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
