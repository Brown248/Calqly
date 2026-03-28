import Link from 'next/link'

export function Footer({ lang = 'th' }: { lang?: 'th' | 'en' }) {
  const t = lang === 'th'
    ? {
        tagline: 'ความรู้การเงิน อธิบายง่าย ใช้ได้จริง',
        calculators: 'เครื่องคิดเลข',
        articles: 'บทความ',
        privacy: 'นโยบายความเป็นส่วนตัว',
        terms: 'ข้อกำหนดการใช้งาน',
        disclaimer: 'ข้อมูลบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการเงิน กรุณาปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจทางการเงิน',
        rights: 'สงวนลิขสิทธิ์',
      }
    : {
        tagline: 'Financial knowledge, explained simply',
        calculators: 'Calculators',
        articles: 'Articles',
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
        disclaimer: 'Information on this website is for educational purposes only and does not constitute financial advice. Please consult a professional before making financial decisions.',
        rights: 'All rights reserved',
      }

  return (
    <footer className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white text-xs font-bold">
                F
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Calqly<span className="text-brand-600">.th</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.tagline}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              {t.calculators}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/calculators/loan', label: lang === 'th' ? 'คำนวณสินเชื่อ' : 'Loan Calculator' },
                { href: '/calculators/tax', label: lang === 'th' ? 'ภาษีเงินได้' : 'Income Tax' },
                { href: '/calculators/retirement', label: lang === 'th' ? 'วางแผนเกษียณ' : 'Retirement' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            ⚠️ {t.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800 sm:flex-row">
          <p>© {new Date().getFullYear()} Calqly — {t.rights}</p>
          <p>Made with ♥ in Thailand</p>
        </div>
      </div>
    </footer>
  )
}
