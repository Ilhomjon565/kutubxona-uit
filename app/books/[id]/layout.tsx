import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${apiUrl}/api/books/${params.id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch book');
    }
    
    const book = await res.json();
    
    const imageUrl = book.image?.startsWith('http') 
      ? book.image 
      : book.image?.startsWith('/uploads')
      ? `${apiUrl}${book.image}`
      : `${siteUrl}/logo.png`;

    return {
      title: `${book.title} | UIT Kutubxona`,
      description: book.description || `${book.title} - ${book.category} kategoriyasidagi kitob. UIT Kutubxonasidan yuklab oling.`,
      keywords: [
        book.title,
        book.category,
        "UIT kutubxona",
        "raqamli kutubxona",
        "elektron kitoblar",
        "yuklab olish",
        "PDF kitoblar",
        "darsliklar",
        "ilmiy adabiyotlar",
        "badiiy kitoblar",
        book.author || "",
      ].filter(Boolean),
      openGraph: {
        type: "book",
        title: book.title,
        description: book.description || `${book.title} - UIT Kutubxonasi`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 1600,
            alt: book.title,
          },
        ],
        siteName: "UIT Kutubxona",
      },
      twitter: {
        card: "summary_large_image",
        title: book.title,
        description: book.description || `${book.title} - UIT Kutubxonasi`,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${siteUrl}/books/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: "Kitob | UIT Kutubxona",
      description: "UIT Kutubxonasidagi kitob",
    };
  }
}

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

