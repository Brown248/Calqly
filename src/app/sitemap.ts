import { MetadataRoute } from 'next'
// หากคุณต้องการให้หน้าบทความ (Dynamic Routes) เข้าไปอยู่ใน Sitemap ด้วย 
// สามารถ Import ข้อมูลบทความจากไฟล์ data ของคุณมาใช้ได้ เช่น:
// import { articles } from '@/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calqly.co'

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

  // 2. (ทางเลือก) การเพิ่มหน้าบทความ (Dynamic Routes) เข้าไปใน Sitemap แบบอัตโนมัติ
  // หากในไฟล์ '@/data/articles' มีข้อมูลตัวแปร articles อยู่ สามารถเอาคอมเมนต์ออกและใช้งานได้เลย
  /*
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(), // หรือใช้ article.updatedAt ถ้ามี
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticRoutes, ...articleRoutes]
  */

  return [...staticRoutes]
}