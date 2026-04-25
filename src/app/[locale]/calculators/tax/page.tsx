import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import TaxCalculatorClient from './TaxCalculatorClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'TaxCalculator' })

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: t('meta_description'),
    keywords: t('meta_keywords').split(', '),
  }
}

export default async function TaxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'TaxCalculator' })

  return (
    <>
      {/* SoftwareApplication Schema */}
      <Script
        id="tax-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": t('app_schema_name'),
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
      
      {/* FAQ Schema for Tax */}
      <Script
        id="tax-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t('faq_q1'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq_a1')
                }
              },
              {
                "@type": "Question",
                "name": t('faq_q2'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq_a2')
                }
              }
            ]
          })
        }}
      />
      
      <TaxCalculatorClient />
    </>
  )
}
