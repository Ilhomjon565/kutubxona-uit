import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Book, Info, Phone, Mail, MapPin, Facebook, Instagram, Send, ExternalLink, Library } from "lucide-react";
import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";

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
  description: "University of Innovation Technologies (UIT) raqamli kutubxonasi. Qoraqalpog'iston Respublikasidagi birinchi nodavlat oliy ta'lim muassasasi. Elektron kitoblar, darsliklar, ilmiy adabiyotlar va badiiy asarlar.",
  keywords: [
    "UIT kutubxona",
    "raqamli kutubxona",
    "elektron kitoblar",
    "Nukus",
    "Qoraqalpog'iston",
    "University of Innovation Technologies",
    "UIT Nukus",
    "elektron darsliklar",
    "ilmiy adabiyotlar",
    "badiiy kitoblar",
    "kutubxona",
    "kitoblar",
    "yuklab olish",
    "PDF kitoblar",
    "raqamli adabiyotlar",
    "ta'lim resurslari",
    "o'zbekiston kutubxonasi",
    "nodavlat universitet",
    "innovatsion texnologiyalar",
    "bilimlar markazi",
    "o'qish",
    "kitob o'qish",
    "adabiyotlar",
    "darsliklar",
    "ilmiy kitoblar",
    "universitet kutubxonasi"
  ],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: siteUrl,
    siteName: "UIT Kutubxona",
    title: "UIT Kutubxona - Raqamli Kutubxona",
    description: "University of Innovation Technologies raqamli kutubxonasi. Elektron kitoblar, darsliklar va ilmiy adabiyotlar.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "UIT Kutubxona Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UIT Kutubxona - Raqamli Kutubxona",
    description: "University of Innovation Technologies raqamli kutubxonasi",
    images: [`${siteUrl}/logo.png`],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: siteUrl,
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
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
