import { MetadataRoute } from 'next'
import { ARTICLES } from '@/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calqlyhub.com' // อัปเดตให้ตรงกับโดเมนจริงแบบ 100%

  // 1. หน้าหลัก (Static Routes)
  const routes = [
    '',
    '/about-us',
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
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. ปล่อยพลัง! ดึงหน้าบทความทั้งหมดที่มีในระบบเข้า Sitemap อัตโนมัติ (Dynamic Routes)
  const articleRoutes = ARTICLES.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}