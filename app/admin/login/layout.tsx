import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - Kutubxona Boshqaruv Tizimi",
  description: "Admin paneliga kirish sahifasi",
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
