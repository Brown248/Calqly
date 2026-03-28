'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdLeaderboard, AdRectangle } from '@/components/ads/AdUnit'
import { trackLanguageSwitch } from '@/lib/analytics'

// ใน production ควรดึงจาก CMS หรือ MDX files
const ARTICLES = [
  {
    slug: 'thai-tax-deduction-guide-2566',
    title: { th: 'สรุปค่าลดหย่อนภาษี 2566 ทุกรายการ', en: 'Complete Thai Tax Deduction Guide 2023' },
    excerpt: {
      th: 'รวมทุกรายการค่าลดหย่อนภาษีเงินได้บุคคลธรรมดา ตั้งแต่ค่าลดหย่อนส่วนตัว ครอบครัว ประกัน และการลงทุน',
      en: 'Complete guide to all Thai personal income tax deductions including personal, family, insurance and investment',
    },
    readTime: 8,
    category: 'tax',
    date: '2024-01-15',
  },
  {
    slug: 'how-to-start-investing-thailand',
    title: { th: 'เริ่มลงทุนยังไงดี สำหรับคนเพิ่งเริ่มต้น', en: 'How to Start Investing in Thailand for Beginners' },
    excerpt: {
      th: 'คู่มือเริ่มต้นลงทุนสำหรับผู้เริ่มต้น ตั้งแต่เลือก broker ไปจนถึงกองทุนรวมแรกของคุณ',
      en: 'A complete beginner\'s guide to investing in Thailand from choosing a broker to your first fund',
    },
    readTime: 12,
    category: 'investment',
    date: '2024-01-10',
  },
  {
    slug: 'provident-fund-explained',
    title: { th: 'กองทุนสำรองเลี้ยงชีพ คืออะไร ดีแค่ไหน', en: 'Thai Provident Fund (PVD) Explained Simply' },
    excerpt: {
      th: 'อธิบายกองทุนสำรองเลี้ยงชีพแบบง่ายๆ ว่าทำงานยังไง ลดหย่อนภาษีได้เท่าไหร่ ควรลงทุนเพิ่มไหม',
      en: 'Simple explanation of Thailand\'s Provident Fund system, tax benefits and whether you should increase contributions',
    },
    readTime: 6,
    category: 'investment',
    date: '2024-01-05',
  },
  {
    slug: 'refinancing-guide',
    title: { th: 'รีไฟแนนซ์บ้าน ควรทำไหม คำนวณยังไง', en: 'Home Refinancing in Thailand: Should You Do It?' },
    excerpt: {
      th: 'เมื่อไหร่ควรรีไฟแนนซ์ วิธีคำนวณว่าคุ้มหรือไม่ และสิ่งที่ต้องระวังก่อนตัดสินใจ',
      en: 'When to refinance your mortgage, how to calculate if it\'s worth it, and what to watch out for',
    },
    readTime: 7,
    category: 'loan',
    date: '2023-12-28',
  },
  {
    slug: 'rmf-ssf-explained',
    title: { th: 'RMF vs SSF ต่างกันยังไง เลือกอะไรดี', en: 'RMF vs SSF: What\'s the Difference?' },
    excerpt: {
      th: 'เปรียบเทียบ RMF และ SSF อย่างละเอียด เงื่อนไขการลดหย่อน วิธีเลือกกองทุนที่ใช่สำหรับคุณ',
      en: 'Detailed comparison of Thailand\'s RMF and SSF tax-saving funds to help you choose the right one',
    },
    readTime: 9,
    category: 'investment',
    date: '2023-12-20',
  },
  {
    slug: 'retirement-planning-101',
    title: { th: 'วางแผนเกษียณจากศูนย์ ขั้นตอนแรกที่ต้องทำ', en: 'Retirement Planning from Scratch: First Steps' },
    excerpt: {
      th: 'ถ้ายังไม่เริ่มวางแผนเกษียณ อ่านบทความนี้ก่อนเลย อธิบายทุกอย่างตั้งแต่เริ่มต้นจนมีแผนที่ชัดเจน',
      en: 'If you haven\'t started retirement planning, start here. A step-by-step guide for Thai workers',
    },
    readTime: 10,
    category: 'investment',
    date: '2023-12-15',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  loan:       'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  tax:        'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  investment: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
}

export default function ArticlesPage() {
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleLangChange = (newLang: 'th' | 'en') => {
    trackLanguageSwitch(lang, newLang)
    setLang(newLang)
  }

  const categories = ['all', 'tax', 'investment', 'loan']
  const categoryLabels: Record<string, { th: string; en: string }> = {
    all:        { th: 'ทั้งหมด', en: 'All' },
    tax:        { th: 'ภาษี', en: 'Tax' },
    investment: { th: 'การลงทุน', en: 'Investing' },
    loan:       { th: 'สินเชื่อ', en: 'Loans' },
  }

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory)

  const t = lang === 'th'
    ? { title: 'บทความการเงิน', sub: 'อธิบายง่าย เข้าใจได้ ใช้ได้จริง', readMin: 'นาที', readMore: 'อ่านต่อ →' }
    : { title: 'Finance Articles', sub: 'Simply explained, actionable knowledge', readMin: 'min read', readMore: 'Read more →' }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header lang={lang} onLangChange={handleLangChange} />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{t.sub}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {categoryLabels[cat]?.[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdLeaderboard />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Featured first article */}
        {filtered[0] && (
          <Link
            href={`/articles/${filtered[0].slug}`}
            className="group mb-6 block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[filtered[0].category]}`}>
              {categoryLabels[filtered[0].category]?.[lang]}
            </span>
            <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
              {filtered[0].title[lang]}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {filtered[0].excerpt[lang]}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">{filtered[0].readTime} {t.readMin}</span>
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{t.readMore}</span>
            </div>
          </Link>
        )}

        {/* Ad between featured and grid */}
        <div className="mb-8 flex justify-center">
          <AdRectangle />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[article.category]}`}>
                {categoryLabels[article.category]?.[lang]}
              </span>
              <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                {article.title[lang]}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {article.excerpt[lang]}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{article.readTime} {t.readMin}</span>
                <span className="text-xs font-medium text-brand-600">{t.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
