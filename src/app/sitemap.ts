import { MetadataRoute } from 'next';
import { ARTICLES } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

  // 1. กำหนดหน้าเว็บแบบ Static ทั้งหมดที่มีในโปรเจค
  const routes = [
    '', // หน้าแรก (/)
    '/about-us',
    '/calculators',
    '/calculators/tax',
    '/calculators/loan',
    '/calculators/retirement',
    '/calculators/roi',
    '/calculators/credit-cards',
    '/articles',
    '/terms',
    '/privacy',
  ]

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8, // หน้าแรกให้ความสำคัญสูงสุด (1.0)
  }))

  const articleRoutes = ARTICLES.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticRoutes, ...articleRoutes]
}