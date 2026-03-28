'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdLeaderboard, AdSidebar, AdInContent } from '@/components/ads/AdUnit'
import { LoanCalculator } from '@/components/calculators/LoanCalculator'
import { TaxCalculator } from '@/components/calculators/TaxCalculator'
import { RetirementCalculator } from '@/components/calculators/RetirementCalculator'
import { CALCULATORS } from '@/lib/calculators'
import { trackLanguageSwitch } from '@/lib/analytics'

interface Props {
  slug: string
}

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType<{ lang: 'th' | 'en' }>> = {
  loan:       LoanCalculator,
  tax:        TaxCalculator,
  retirement: RetirementCalculator,
}

export function CalculatorPageClient({ slug }: Props) {
  const [lang, setLang] = useState<'th' | 'en'>('th')

  const calc = CALCULATORS.find((c) => c.slug === slug)
  if (!calc) return null

  const handleLangChange = (newLang: 'th' | 'en') => {
    trackLanguageSwitch(lang, newLang)
    setLang(newLang)
  }

  const CalculatorComponent = CALCULATOR_COMPONENTS[slug]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header lang={lang} onLangChange={handleLangChange} />

      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              {lang === 'th' ? 'หน้าแรก' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/calculators" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              {lang === 'th' ? 'เครื่องคิดเลข' : 'Calculators'}
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300">{calc.title[lang]}</span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {calc.title[lang]}
          </h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400">
            {calc.description[lang]}
          </p>
        </div>
      </div>

      {/* Top Ad */}
      <div className="bg-white dark:bg-slate-900 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdLeaderboard />
        </div>
      </div>

      {/* Main Content + Sidebar layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Calculator — takes most space */}
          <main className="min-w-0 flex-1">
            {CalculatorComponent ? (
              <CalculatorComponent lang={lang} />
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="text-slate-500">Calculator coming soon</p>
              </div>
            )}

            {/* Related Articles */}
            {calc.relatedArticles.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {lang === 'th' ? 'บทความที่เกี่ยวข้อง' : 'Related Articles'}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {calc.relatedArticles.map((articleSlug) => (
                    <Link
                      key={articleSlug}
                      href={`/articles/${articleSlug}`}
                      className="rounded-xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600">
                        {articleSlug.replace(/-/g, ' ')} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Ad (in-content) */}
            <AdInContent />
          </main>

          {/* Sidebar — visible on lg+ only */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdSidebar />

            {/* Other Calculators */}
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {lang === 'th' ? 'เครื่องคิดเลขอื่นๆ' : 'Other Calculators'}
              </h3>
              <div className="space-y-2">
                {CALCULATORS.filter((c) => c.slug !== slug).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/calculators/${c.slug}`}
                    className="block rounded-xl border border-slate-100 bg-white p-3.5 text-sm font-medium text-slate-700 hover:border-brand-200 hover:text-brand-700 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-800 dark:hover:text-brand-400"
                  >
                    {c.title[lang]}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  )
}
