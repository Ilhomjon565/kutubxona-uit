import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Book, Info, Phone, Mail, MapPin, Facebook, Instagram, Send, ExternalLink, Library } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UIT Kutubxona - University of Innovation Technologies Raqamli Kutubxonasi",
    template: "%s | UIT Kutubxona"
  },
  description: "University of Innovation Technologies (UIT) raqamli kutubxonasi. Qoraqalpog'iston Respublikasidagi birinchi nodavlat oliy ta'lim muassasasi.",
  keywords: ["UIT kutubxona", "raqamli kutubxona", "elektron kitoblar", "Nukus", "Qoraqalpog'iston"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#fcfdfe]`}>
        {/* Navigation with Enhanced Animations */}
        <nav className="sticky top-0 z-50 glass-enhanced border-b border-gray-100/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center gap-2 group magnetic">
                <div className="bg-gradient-to-br from-[#0056b3] to-[#00a8ff] p-2 rounded-lg shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#0f172a] leading-tight group-hover:text-[#0056b3] transition-colors">UIT</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#0056b3] font-bold">Kutubxona</span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-gray-600 hover:text-[#0056b3] transition-all relative group"
                >
                  Asosiy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] group-hover:w-full transition-all duration-300" />
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm font-medium text-gray-600 hover:text-[#0056b3] transition-all relative group"
                >
                  Biz haqimizda
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] group-hover:w-full transition-all duration-300" />
                </Link>
                <a 
                  href="https://uit.uz" 
                  target="_blank" 
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#0056b3] transition-all relative group"
                >
                  Universitet 
                  <ExternalLink className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] group-hover:w-full transition-all duration-300" />
                </a>
              </div>

            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#0f172a] text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg">
                    <Library className="w-6 h-6 text-[#0056b3]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight">UIT</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kutubxona</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  University of Innovation Technologies (UIT) - zamonaviy ta'lim va innovatsiyalar markazi. Bizning raqamli kutubxonamiz bilan bilimlaringizni oshiring.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-[#0056b3] transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-[#0056b3] transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://t.me/uit_uz_official" className="p-2 bg-white/5 rounded-lg hover:bg-[#0056b3] transition-all">
                    <Send className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-6">Foydali havolalar</h3>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><Book className="w-4 h-4" /> Barcha kitoblar</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><Info className="w-4 h-4" /> Biz haqimizda</Link></li>
                  <li><a href="https://uit.uz" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Universitet sayti</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold mb-6">Bog'lanish</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-[#0056b3] shrink-0" />
                    <span className="text-sm">Qoraqalpog'iston Respublikasi, Nukus shahri, Tatibayev ko'chasi 2.</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-5 h-5 text-[#0056b3] shrink-0" />
                    <a href="tel:+998712000000" className="text-sm hover:text-white">+998 71 200 00 00</a>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5 text-[#0056b3] shrink-0" />
                    <a href="mailto:info@uit.uz" className="text-sm hover:text-white">info@uit.uz</a>
                  </li>
                </ul>
              </div>

              {/* University Logo/Badge */}
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <img src="/logo.png" alt="UIT Logo" className="w-24 h-24 mb-4 object-contain" />
                <span className="text-xs text-center text-gray-400 uppercase tracking-tighter">University of Innovation Technologies</span>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} UIT Kutubxona. Barcha huquqlar himoyalangan.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Maxfiylik siyosati</a>
                <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Foydalanish shartlari</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
