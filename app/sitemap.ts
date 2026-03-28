import type { MetadataRoute } from 'next'
import { CALCULATORS } from '@/lib/calculators'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finwise.th'

// Article slugs — ใน production ดึงจาก CMS
const ARTICLE_SLUGS = [
  'thai-tax-deduction-guide-2566',
  'how-to-start-investing-thailand',
  'provident-fund-explained',
  'refinancing-guide',
  'rmf-ssf-explained',
  'retirement-planning-101',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const calculatorPages: MetadataRoute.Sitemap = CALCULATORS.map((calc) => ({
    url: `${BASE_URL}/calculators/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = ARTICLE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...calculatorPages, ...articlePages]
}
