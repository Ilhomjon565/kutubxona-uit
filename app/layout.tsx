import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "University of Innovation Technologies (UIT) raqamli kutubxonasi. Qoraqalpog'iston Respublikasidagi birinchi nodavlat oliy ta'lim muassasasining elektron kitoblar, darsliklar va ilmiy materiallar to'plami.",
  keywords: [
    "UIT kutubxona",
    "University of Innovation Technologies",
    "raqamli kutubxona",
    "elektron kitoblar",
    "darsliklar",
    "ilmiy adabiyotlar",
    "Qoraqalpog'iston",
    "Nukus",
    "oliy ta'lim",
    "universitet kutubxonasi",
    "e-kitoblar",
    "akademik adabiyotlar"
  ],
  authors: [{ name: "University of Innovation Technologies" }],
  creator: "University of Innovation Technologies",
  publisher: "University of Innovation Technologies",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/logo.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: siteUrl,
    siteName: "UIT Kutubxona",
    title: "UIT Kutubxona - University of Innovation Technologies Raqamli Kutubxonasi",
    description: "University of Innovation Technologies raqamli kutubxonasi. Elektron kitoblar, darsliklar va ilmiy materiallar to'plami.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "UIT Kutubxona Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UIT Kutubxona - University of Innovation Technologies Raqamli Kutubxonasi",
    description: "University of Innovation Technologies raqamli kutubxonasi. Elektron kitoblar, darsliklar va ilmiy materiallar.",
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0056b3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UIT Kutubxona" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Library",
              "name": "UIT Kutubxona",
              "alternateName": "University of Innovation Technologies Digital Library",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.png`,
              "image": `${siteUrl}/logo.png`,
              "description": "University of Innovation Technologies raqamli kutubxonasi",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "UZ",
                "addressRegion": "Qoraqalpog'iston",
                "addressLocality": "Nukus"
              },
              "parentOrganization": {
                "@type": "EducationalOrganization",
                "name": "University of Innovation Technologies",
                "url": "https://uit.uz",
                "logo": `${siteUrl}/logo.png`
              },
              "sameAs": [
                "https://uit.uz"
              ]
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
