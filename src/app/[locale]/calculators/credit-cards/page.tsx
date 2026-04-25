import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CreditCardsClient from './CreditCardsClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CreditCards' })
  const isTh = locale === 'th'

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: isTh 
      ? 'เปรียบเทียบบัตรเครดิตจากธนาคารชั้นนำในไทย 2569 ค้นหาบัตรที่คุ้มค่าที่สุด ทั้งสายเงินคืน สะสมแต้ม และแลกไมล์' 
      : 'Compare top credit cards in Thailand 2026. Find the best cards for cashback, rewards points, and travel miles.',
    keywords: isTh 
      ? ['เปรียบเทียบบัตรเครดิต', 'บัตรเครดิตไหนดี 2569', 'บัตรเครดิตเงินคืน', 'บัตรเครดิตสะสมแต้ม', 'สมัครบัตรเครดิตออนไลน์']
      : ['Compare Credit Cards Thailand', 'Best Cashback Cards 2026', 'Rewards Credit Cards', 'Travel Cards Thailand'],
  }
}

export default async function CreditCardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Script
        id="cc-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": locale === 'th' ? "เครื่องมือเปรียบเทียบบัตรเครดิต" : "Credit Card Comparison Tool",
            "operatingSystem": "All",
            "applicationCategory": "FinanceApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "THB"
            }
          })
        }}
      />
      <CreditCardsClient />
    </>
  )
}
