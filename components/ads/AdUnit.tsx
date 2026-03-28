'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// ============================================================
// AdUnit — Google AdSense wrapper
// ============================================================

interface AdUnitProps {
  client?: string
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  position?: string
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdUnit({
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXXXXXXXXX',
  slot,
  format = 'auto',
  responsive = true,
  className,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // 1. เช็คว่าถ้าแท็ก <ins> ยังไม่พร้อม หรือเคย push โฆษณาไปแล้ว ให้หยุดทำงานทันที
    if (!adRef.current || pushed.current) return

    // 2. ป้องกันบั๊กขั้นสุด: เช็คว่า AdSense แอบเติมโฆษณาไปแล้วหรือยัง
    if (adRef.current.getAttribute('data-ad-status') === 'filled') return

    pushed.current = true

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // ไม่ต้อง log ให้ console รก
    }
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900',
          format === 'horizontal' && 'h-[90px] w-full',
          format === 'rectangle' && 'h-[250px] w-[300px]',
          format === 'vertical' && 'h-[600px] w-[160px]',
          format === 'auto' && 'min-h-[90px] w-full',
          className
        )}
      >
        📢 Ad Slot: {slot}
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden flex justify-center', className)}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

// ============================================================
// Ad placement presets — สวยงาม เนียนไปกับ UI
// ============================================================

export function AdLeaderboard({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto my-6 flex w-full max-w-4xl flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/50 dark:bg-slate-900/20', className)}>
      <span className="mb-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">Advertisement</span>
      <AdUnit
        slot={process.env.NEXT_PUBLIC_AD_SLOT_LEADERBOARD ?? '1234567890'}
        format="horizontal"
        position="leaderboard"
        className="w-full"
      />
    </div>
  )
}

export function AdRectangle({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto my-6 flex w-full max-w-[336px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/50 dark:bg-slate-900/20', className)}>
      <span className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">Advertisement</span>
      <AdUnit
        slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE ?? '0987654321'}
        format="rectangle"
        position="rectangle"
      />
    </div>
  )
}

export function AdInContent({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto my-10 flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50', className)}>
      <span className="mb-3 text-[10px] font-medium uppercase tracking-widest text-slate-400">Sponsored</span>
      <AdUnit
        slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT ?? '1122334455'}
        format="auto"
        position="in_content"
        className="w-full"
      />
    </div>
  )
}

export function AdSidebar({ className }: { className?: string }) {
  return (
    <div className={cn('sticky top-24 flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/50 dark:bg-slate-900/20', className)}>
      <span className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">Advertisement</span>
      <AdUnit
        slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? '5544332211'}
        format="vertical"
        position="sidebar"
      />
    </div>
  )
}