import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoanCalculatorClient from './LoanCalculatorClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'LoanCalculator' })
  const isTh = locale === 'th'

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: isTh 
      ? 'คำนวณค่างวดสินเชื่อบ้าน รถ และส่วนบุคคลออนไลน์ อัปเดตดอกเบี้ย 2569 พร้อมตารางผ่อนชำระละเอียดและตัวช่วยวิเคราะห์การโปะเพิ่ม' 
      : 'Online Home, Car, and Personal Loan Calculator 2026. Get detailed amortization schedules and impact analysis for extra payments.',
    keywords: isTh 
      ? ['คำนวณดอกเบี้ยบ้าน', 'คำนวณค่างวดรถ', 'โปรแกรมคำนวณเงินกู้', 'ตารางผ่อนลม', 'รีไฟแนนซ์ 2569']
      : ['Thai Home Loan Calculator', 'Mortgage Calculator Thailand', 'Car Loan Calculator', 'Interest Savings Calculator'],
  }
}

export default async function LoanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      {/* SoftwareApplication Schema */}
      <Script
        id="loan-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": locale === 'th' ? "โปรแกรมคำนวณสินเชื่อ 2569" : "Thai Loan Calculator 2026",
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
      
      {/* FAQ Schema for Loan */}
      <Script
        id="loan-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": locale === 'th' ? "การโปะบ้านช่วยประหยัดดอกเบี้ยได้จริงไหม?" : "Does extra payment save mortgage interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": locale === 'th' ? "จริงอย่างมาก เพราะเงินที่โปะเพิ่มจะไปหักเงินต้นโดยตรง 100% ทำให้เงินต้นลดลงเร็วขึ้นและประหยัดดอกเบี้ยสะสมได้มหาศาล" : "Yes, absolutely. Extra payments go directly towards reducing the principal, which lowers the interest charged in subsequent periods and shortens the loan term."
                }
              },
              {
                "@type": "Question",
                "name": locale === 'th' ? "ควรเลือกผ่อนบ้านกี่ปี?" : "How many years should I choose for a home loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": locale === 'th' ? "โดยทั่วไปธนาคารให้กู้สูงสุด 30-40 ปี แต่แนะนำให้เลือกตามความสามารถในการผ่อนที่ไม่เกิน 30-40% ของรายได้" : "Banks usually offer up to 30-40 years. It's recommended to choose a term where monthly payments don't exceed 30-40% of your income."
                }
              }
            ]
          })
        }}
      />
      
      <LoanCalculatorClient />
    </>
  )
}
