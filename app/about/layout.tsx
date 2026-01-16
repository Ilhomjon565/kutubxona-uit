import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kutubxona.uit.uz';

export const metadata: Metadata = {
  title: "Biz haqimizda | UIT Kutubxona",
  description: "University of Innovation Technologies (UIT) haqida batafsil ma'lumot. Qoraqalpog'iston Respublikasidagi birinchi nodavlat oliy ta'lim muassasasi. 8000+ talaba, 200+ professor-o'qituvchi.",
  keywords: [
    "UIT",
    "University of Innovation Technologies",
    "Nukus universiteti",
    "Qoraqalpog'iston universiteti",
    "nodavlat universitet",
    "ta'lim",
    "oliy ta'lim",
    "innovatsion texnologiyalar",
    "UIT Nukus",
    "UIT talabalar",
    "UIT reyting",
    "Times Higher Education",
    "UI Green Metric",
    "Qoraqalpog'iston ta'lim",
    "Nukus ta'lim",
    "universitet",
    "kutubxona",
    "raqamli kutubxona"
  ],
  openGraph: {
    type: "website",
    title: "Biz haqimizda | UIT Kutubxona",
    description: "University of Innovation Technologies (UIT) haqida batafsil ma'lumot",
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "UIT Logo",
      },
    ],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

