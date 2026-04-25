import { MetadataRoute } from 'next'
import { getArticles } from '@/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calqlyhub.com'
  const locales = ['th', 'en']

  const paths = [
    '',
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

  const staticRoutes: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    paths.forEach((path) => {
      const isDefault = locale === 'th'
      const url = isDefault ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`
      
      staticRoutes.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1.0 : 0.8,
      })
    })
  })

  // Dynamic Article Routes for all locales
  const articleRoutes: MetadataRoute.Sitemap = []
  
  locales.forEach((locale) => {
    const articles = getArticles(locale)
    articles.forEach((article) => {
      const isDefault = locale === 'th'
      const url = isDefault 
        ? `${baseUrl}/articles/${article.slug}` 
        : `${baseUrl}/${locale}/articles/${article.slug}`

      // Safely convert BE date (Thai) to AD for Date object
      // BE 2569 -> AD 2026
      let lastModDate = new Date()
      try {
        const parts = article.date.split('-')
        if (parts.length === 3) {
          let year = parseInt(parts[0])
          if (year > 2400) year -= 543 // Convert BE to AD
          lastModDate = new Date(year, parseInt(parts[1]) - 1, parseInt(parts[2]))
        }
      } catch (e) {
        // Fallback to now
      }

      articleRoutes.push({
        url,
        lastModified: lastModDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    })
  })

  return [...staticRoutes, ...articleRoutes]
}
