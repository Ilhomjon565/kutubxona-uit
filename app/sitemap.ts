import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kutubxona.uit.uz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch all books for dynamic sitemap
    const res = await fetch(`${apiUrl}/api/books`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!res.ok) {
      return baseUrls;
    }
    
    const books = await res.json();
    
    const bookUrls: MetadataRoute.Sitemap = books.map((book: { _id: string; updatedAt?: string }) => ({
      url: `${siteUrl}/books/${book._id}`,
      lastModified: book.updatedAt ? new Date(book.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...baseUrls, ...bookUrls];
  } catch (error) {
    console.error('Error fetching books for sitemap:', error);
    return baseUrls;
  }
}

