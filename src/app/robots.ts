import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // หากในอนาคตมีหน้าที่ไม่อยากให้ Google ค้นเจอ ค่อยมาเพิ่มตรงนี้ครับ
    },
    sitemap: 'https://calqlyhub.com/sitemap.xml',
  }
}