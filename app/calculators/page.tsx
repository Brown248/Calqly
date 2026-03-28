'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdLeaderboard } from '@/components/ads/AdUnit'
import { CALCULATORS } from '@/lib/calculators'
import { trackLanguageSwitch } from '@/lib/analytics'

const CATEGORY_COLORS: Record<string, string> = {
  loan:       'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  tax:        'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  investment: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  insurance:  'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
}

const CATEGORY_LABELS: Record<string, { th: string; en: string }> = {
  loan:       { th: 'สินเชื่อ', en: 'Loan' },
  tax:        { th: 'ภาษี', en: 'Tax' },
  investment: { th: 'การลงทุน', en: 'Investment' },
  insurance:  { th: 'ประกัน', en: 'Insurance' },
}

export default function CalculatorsPage() {
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const handleLangChange = (newLang: 'th' | 'en') => {
    trackLanguageSwitch(lang, newLang)
    setLang(newLang)
  }

  const categories = ['all', ...Array.from(new Set(CALCULATORS.map((c) => c.category)))]

  const filtered =
    activeCategory === 'all'
      ? CALCULATORS
      : CALCULATORS.filter((c) => c.category === activeCategory)

  const t = lang === 'th'
    ? { title: 'เครื่องคิดเลขการเงิน', sub: 'คำนวณได้เลย ไม่ต้องลงทะเบียน', all: 'ทั้งหมด', calculate: 'คำนวณเลย →' }
    : { title: 'Financial Calculators', sub: 'Free calculators, no sign-up required', all: 'All', calculate: 'Calculate →' }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header lang={lang} onLangChange={handleLangChange} />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{t.sub}</p>

          {/* Category Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
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
                {cat === 'all' ? t.all : (CATEGORY_LABELS[cat]?.[lang] ?? cat)}
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800"
            >
              <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[calc.category]}`}>
                {CATEGORY_LABELS[calc.category]?.[lang] ?? calc.category}
              </span>
              <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                {calc.title[lang]}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {calc.description[lang]}
              </p>
              <div className="mt-5 text-sm font-medium text-brand-600 dark:text-brand-400">
                {t.calculate}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
