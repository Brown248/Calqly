'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdLeaderboard, AdRectangle } from '@/components/ads/AdUnit'
import { CALCULATORS } from '@/lib/calculators'
import { trackLanguageSwitch } from '@/lib/analytics'

const FEATURED_ARTICLES = [
  {
    slug: 'thai-tax-deduction-guide-2566',
    title: { th: 'สรุปค่าลดหย่อนภาษี 2566 ทุกรายการ', en: 'Complete Thai Tax Deduction Guide 2023' },
    excerpt: {
      th: 'ลดหย่อนภาษีได้อีกเยอะ! รวมทุกรายการตั้งแต่ค่าลดหย่อนส่วนตัว ประกันชีวิต RMF SSF และอื่นๆ',
      en: 'Maximize your tax savings with this complete guide to all Thai tax deductions',
    },
    readTime: 8,
    category: 'tax',
  },
  {
    slug: 'how-to-start-investing-thailand',
    title: { th: 'เริ่มลงทุนยังไงดี สำหรับคนเพิ่งเริ่มต้น', en: 'How to Start Investing in Thailand' },
    excerpt: {
      th: 'ไม่รู้จะเริ่มลงทุนจากไหนดี? บทความนี้อธิบายทุกอย่างตั้งแต่พื้นฐานจนลงมือทำจริง',
      en: 'A complete beginner\'s guide to investing in Thailand, from basics to first steps',
    },
    readTime: 12,
    category: 'investment',
  },
  {
    slug: 'provident-fund-explained',
    title: { th: 'กองทุนสำรองเลี้ยงชีพ คืออะไร ดีแค่ไหน', en: 'Thai Provident Fund Explained Simply' },
    excerpt: {
      th: 'กองทุนสำรองเลี้ยงชีพดีกว่าที่คิด อธิบายง่ายๆ พร้อมตัวอย่างคำนวณ',
      en: 'Everything you need to know about Thailand\'s provident fund system',
    },
    readTime: 6,
    category: 'investment',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  loan: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  tax: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  investment: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  insurance: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
}

export default function HomePage() {
  const [lang, setLang] = useState<'th' | 'en'>('th')

  const handleLangChange = (newLang: 'th' | 'en') => {
    trackLanguageSwitch(lang, newLang)
    setLang(newLang)
  }

  const t = lang === 'th'
    ? {
        hero: 'ความรู้การเงิน อธิบายง่าย',
        heroSub: 'เครื่องคิดเลขการเงินและบทความอธิบายง่ายๆ สำหรับคนไทย ใช้ฟรี ไม่มีโฆษณารบกวน',
        calcSection: 'เครื่องคิดเลขการเงิน',
        articleSection: 'บทความล่าสุด',
        readMin: 'นาที',
        readMore: 'อ่านต่อ →',
        viewAllCalc: 'ดูเครื่องคิดเลขทั้งหมด',
        viewAllArticle: 'ดูบทความทั้งหมด',
      }
    : {
        hero: 'Financial Knowledge, Simply Explained',
        heroSub: 'Free financial calculators and easy-to-understand articles for everyone',
        calcSection: 'Financial Calculators',
        articleSection: 'Latest Articles',
        readMin: 'min read',
        readMore: 'Read more →',
        viewAllCalc: 'View all calculators',
        viewAllArticle: 'View all articles',
      }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header lang={lang} onLangChange={handleLangChange} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-balance leading-tight">
              {t.hero}
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              {t.heroSub}
            </p>
          </div>
        </div>
      </section>

      {/* Ad Leaderboard — ใต้ hero แต่ก่อน content หลัก */}
      <div className="bg-white dark:bg-slate-900 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdLeaderboard />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Calculators Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.calcSection}</h2>
            <Link href="/calculators" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              {t.viewAllCalc}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculators/${calc.slug}`}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800"
              >
                <div className="mb-3">
                  <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[calc.category]}`}>
                    {calc.category}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                  {calc.title[lang]}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {calc.description[lang]}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-brand-600 dark:text-brand-400">
                  {lang === 'th' ? 'คำนวณเลย' : 'Calculate'} →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mid-page Ad (Rectangle) — ระหว่าง calculators และ articles */}
        <div className="my-10 flex justify-center">
          <AdRectangle />
        </div>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.articleSection}</h2>
            <Link href="/articles" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              {t.viewAllArticle}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-slate-200 hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3">
                  <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[article.category]}`}>
                    {article.category}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                  {article.title[lang]}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {article.excerpt[lang]}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {article.readTime} {t.readMin}
                  </span>
                  <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                    {t.readMore}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
