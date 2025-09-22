import Link from "next/link"
import { BookOpen, Home, Tag } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <img 
                  src="https://uit.uz/logo.png" 
                  alt="UIT Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Kutubxona</h3>
                <p className="text-xs text-muted-foreground font-medium">Innovatsion Texnologiyalar Universiteti</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Universitetimizning keng kutubxona fondidan foydalaning. Minglab kitoblar, ilmiy maqolalar va boshqa
              resurslar sizni kutmoqda.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Fakultetlar:</strong> 2 ta</p>
              <p><strong>Yo'nalishlar:</strong> 10 ta</p>
              <p><strong>O'qituvchilar:</strong> 213 ta</p>
              <p><strong>Talabalar:</strong> 8000+ ta</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3">Tezkor Havolalar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Kitoblar katalogi
                </Link>
              </li>
              <li>
                <Link href="/books/categories" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Kategoriyalar
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3">Aloqa</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <p className="font-medium">Manzil:</p>
                <p>Qoraqalpog'iston Respublikasi, Xo'jayli tumani, Murtazabiy OFY, Taxitash ko'chasi, 28-uy</p>
              </div>
              <div>
                <p className="font-medium">Telefon:</p>
                <p>+998 (61) 225 65 66</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>info@uit.uz</p>
              </div>
              <div>
                <p className="font-medium">Ish vaqti:</p>
                <p>Dushanba-Juma: 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Innovatsion Texnologiyalar Universiteti. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}
