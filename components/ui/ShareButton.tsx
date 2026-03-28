'use client'

import { useState } from 'react'
import { buildShareUrl } from '@/lib/utils'
import { trackCalculatorShare } from '@/lib/analytics'

interface ShareButtonProps {
  calculatorName: string
  params: Record<string, string | number>
  lang?: 'th' | 'en'
}

export function ShareButton({ calculatorName, params, lang = 'th' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = buildShareUrl(params)

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      trackCalculatorShare(calculatorName)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: prompt
      window.prompt(lang === 'th' ? 'คัดลอก URL นี้:' : 'Copy this URL:', url)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 text-green-500" />
          {lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
        </>
      ) : (
        <>
          <ShareIcon className="h-4 w-4" />
          {lang === 'th' ? 'แชร์ผลลัพธ์' : 'Share Result'}
        </>
      )}
    </button>
  )
}

interface CopyResultProps {
  text: string
  lang?: 'th' | 'en'
}

export function CopyResult({ text, lang = 'th' }: CopyResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('', text)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 text-green-500" />
          {lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4" />
          {lang === 'th' ? 'คัดลอกผล' : 'Copy Result'}
        </>
      )}
    </button>
  )
}

export function PrintButton({ lang = 'th' }: { lang?: 'th' | 'en' }) {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 print:hidden"
    >
      <PrintIcon className="h-4 w-4" />
      {lang === 'th' ? 'พิมพ์' : 'Print'}
    </button>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function PrintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
