'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/calculators', labelTh: 'เครื่องคิดเลข', labelEn: 'Calculators' },
  { href: '/articles', labelTh: 'บทความ', labelEn: 'Articles' },
]

interface HeaderProps {
  lang: 'th' | 'en'
  onLangChange: (lang: 'th' | 'en') => void
}

export function Header({ lang, onLangChange }: HeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // รอให้ client mount ก่อนค่อย render icon — กัน hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold transition-transform group-hover:scale-105">
            F
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            FinWise<span className="text-brand-600">.th</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              )}
            >
              {lang === 'th' ? item.labelTh : item.labelEn}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => onLangChange(lang === 'th' ? 'en' : 'th')}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Switch language"
          >
            {lang === 'th' ? 'EN' : 'ไทย'}
          </button>

          {/* Dark Mode Toggle — ใช้ mounted เพื่อกัน hydration mismatch */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {!mounted ? (
              <div className="h-4 w-4" />
            ) : theme === 'dark' ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800 md:hidden">
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                {lang === 'th' ? item.labelTh : item.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707-.707M6.343 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
