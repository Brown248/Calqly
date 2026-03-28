'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdLeaderboard, AdInContent, AdSidebar } from '@/components/ads/AdUnit'
import { ReadingProgress } from '@/components/articles/ReadingProgress'
import { trackLanguageSwitch } from '@/lib/analytics'

// Demo article content — ใน production ใช้ MDX หรือ CMS
const DEMO_ARTICLE = {
  slug: 'thai-tax-deduction-guide-2566',
  title: { th: 'สรุปค่าลดหย่อนภาษี 2566 ทุกรายการ', en: 'Complete Thai Tax Deduction Guide 2023' },
  readTime: 8,
  category: 'tax',
  date: '2024-01-15',
  toc: [
    { id: 'personal', label: { th: 'ค่าลดหย่อนส่วนตัว', en: 'Personal Deductions' } },
    { id: 'family', label: { th: 'ค่าลดหย่อนครอบครัว', en: 'Family Deductions' } },
    { id: 'insurance', label: { th: 'ประกัน', en: 'Insurance' } },
    { id: 'investment', label: { th: 'การลงทุน (RMF/SSF)', en: 'Investment (RMF/SSF)' } },
  ],
  relatedCalculator: { slug: 'tax', label: { th: 'คำนวณภาษีของคุณ', en: 'Calculate Your Tax' } },
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const article = DEMO_ARTICLE // ใน production: fetch จาก CMS หรือ MDX ตาม params.slug

  const handleLangChange = (newLang: 'th' | 'en') => {
    trackLanguageSwitch(lang, newLang)
    setLang(newLang)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Reading Progress Bar */}
      <ReadingProgress articleSlug={params.slug} />

      <Header lang={lang} onLangChange={handleLangChange} />

      {/* Top Ad */}
      <div className="border-b border-slate-100 dark:border-slate-800 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdLeaderboard />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          {/* Article Content */}
          <main className="min-w-0 flex-1 max-w-2xl">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {lang === 'th' ? 'หน้าแรก' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/articles" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {lang === 'th' ? 'บทความ' : 'Articles'}
              </Link>
              <span>/</span>
              <span className="text-slate-500 line-clamp-1">{article.title[lang]}</span>
            </nav>

            {/* Category + Read time */}
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                {article.category}
              </span>
              <span className="text-sm text-slate-400">
                {article.readTime} {lang === 'th' ? 'นาที' : 'min read'}
              </span>
              <span className="text-sm text-slate-400">{article.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight text-balance">
              {article.title[lang]}
            </h1>

            {/* Table of Contents */}
            <div className="my-8 rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'th' ? 'สารบัญ' : 'Table of Contents'}
              </p>
              <ol className="space-y-2">
                {article.toc.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2.5 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                        {i + 1}
                      </span>
                      {item.label[lang]}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Article Body — ใน production จะ render จาก MDX */}
            <article className="prose-article">
              <h2 id="personal">{lang === 'th' ? 'ค่าลดหย่อนส่วนตัว' : 'Personal Deductions'}</h2>
              <p>
                {lang === 'th'
                  ? 'ค่าลดหย่อนส่วนตัวพื้นฐานที่ทุกคนได้รับโดยอัตโนมัติคือ 60,000 บาท ไม่ว่าจะมีรายได้เท่าไหร่ก็ตาม ส่วนนี้ไม่ต้องทำอะไรเพิ่ม กรมสรรพากรหักให้อัตโนมัติ'
                  : 'Every taxpayer automatically receives a personal deduction of 60,000 THB. No action required – the Revenue Department applies this automatically to all filers.'}
              </p>

              <AdInContent />

              <h2 id="family">{lang === 'th' ? 'ค่าลดหย่อนครอบครัว' : 'Family Deductions'}</h2>
              <ul>
                <li>{lang === 'th' ? 'คู่สมรส: 60,000 บาท (ไม่มีรายได้)' : 'Spouse (no income): 60,000 THB'}</li>
                <li>{lang === 'th' ? 'บุตร: คนละ 30,000 บาท (สูงสุด 3 คน)' : 'Children: 30,000 THB each (max 3)'}</li>
                <li>{lang === 'th' ? 'พ่อแม่: คนละ 30,000 บาท (สูงสุด 4 คน อายุ 60+)' : 'Parents: 30,000 THB each (max 4, age 60+)'}</li>
              </ul>

              <h2 id="insurance">{lang === 'th' ? 'ค่าลดหย่อนประกัน' : 'Insurance Deductions'}</h2>
              <ul>
                <li>{lang === 'th' ? 'ประกันชีวิต: สูงสุด 100,000 บาท' : 'Life insurance: up to 100,000 THB'}</li>
                <li>{lang === 'th' ? 'ประกันสุขภาพ: สูงสุด 25,000 บาท' : 'Health insurance: up to 25,000 THB'}</li>
              </ul>

              <AdInContent />

              <h2 id="investment">{lang === 'th' ? 'การลงทุน (RMF/SSF)' : 'Investment Deductions (RMF/SSF)'}</h2>
              <ul>
                <li>{lang === 'th' ? 'RMF: สูงสุด 30% ของรายได้ หรือ 500,000 บาท' : 'RMF: up to 30% of income or 500,000 THB'}</li>
                <li>{lang === 'th' ? 'SSF: สูงสุด 30% ของรายได้ หรือ 200,000 บาท' : 'SSF: up to 30% of income or 200,000 THB'}</li>
              </ul>
            </article>

            {/* Related Calculator CTA */}
            <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6 dark:border-brand-900/30 dark:bg-brand-950/20">
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-300 mb-2">
                {lang === 'th' ? 'ลองคำนวณภาษีของคุณเลย' : 'Calculate your taxes now'}
              </p>
              <p className="text-sm text-brand-700/70 dark:text-brand-400/70 mb-4">
                {lang === 'th'
                  ? 'ใส่ข้อมูลจริงของคุณเพื่อดูว่าต้องจ่ายภาษีเท่าไหร่'
                  : 'Enter your actual details to see exactly how much tax you owe'}
              </p>
              <Link
                href={`/calculators/${article.relatedCalculator.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                {article.relatedCalculator.label[lang]} →
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdSidebar />
          </aside>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  )
}
