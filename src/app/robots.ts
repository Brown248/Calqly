import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // หากในอนาคตมีหน้าที่ไม่อยากให้ Google ค้นเจอ ค่อยมาเพิ่มตรงนี้ครับ
    },
    sitemap: `${
      process.env.NEXT_PUBLIC_SITE_URL 
        ? process.env.NEXT_PUBLIC_SITE_URL 
        : process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:3000'
    }/sitemap.xml`,
  }
}