import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Tag } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b border-border bg-white shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group hover-lift">
            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
              <img 
                src="https://uit.uz/logo.png" 
                alt="UIT Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="animate-slide-in-left">
              <h1 className="text-lg font-bold text-primary">
                INNOVATSION TEXNOLOGIYALAR UNIVERSITETI
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Kutubxona
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2 animate-slide-in-right">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover-glow hover-lift transition-all duration-300">
                <Home className="h-4 w-4" />
                Bosh Sahifa
              </Button>
            </Link>
            <Link href="/books">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover-glow hover-lift transition-all duration-300">
                <BookOpen className="h-4 w-4" />
                Kitoblar
              </Button>
            </Link>
            <Link href="/books/categories">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover-glow hover-lift transition-all duration-300">
                <Tag className="h-4 w-4" />
                Kategoriyalar
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
