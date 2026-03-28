import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CALCULATORS } from '@/lib/calculators'
import { CalculatorPageClient } from './CalculatorPageClient'

// 1. เปลี่ยน Type ของ params ให้เป็น Promise
interface Props {
  params: Promise<{ slug: string }>
}

// Static params สำหรับ SSG (ไม่ต้องแก้ส่วนนี้ครับ)
export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }))
}

// 2. ใส่ await แกะค่า params ใน generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params // แกะ Promise ตรงนี้
  const calc = CALCULATORS.find((c) => c.slug === resolvedParams.slug)
  if (!calc) return {}

  return {
    title: `${calc.title.th} | ${calc.title.en}`,
    description: calc.description.th,
    keywords: calc.keywords,
    openGraph: {
      title: calc.title.th,
      description: calc.description.th,
      type: 'website',
    },
    alternates: {
      canonical: `/calculators/${calc.slug}`,
    },
  }
}

// 3. เติม async และใส่ await แกะค่า params ใน Component หลัก
export default async function CalculatorPage({ params }: Props) {
  const resolvedParams = await params // แกะ Promise ตรงนี้
  const calc = CALCULATORS.find((c) => c.slug === resolvedParams.slug)
  if (!calc) notFound()

  return (
    // Suspense จำเป็นเพราะ CalculatorPageClient ใช้ useSearchParams
    <Suspense fallback={<div className="animate-pulse h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl" />}>
      {/* ส่ง resolvedParams.slug ไปให้ Client Component */}
      <CalculatorPageClient slug={resolvedParams.slug} />
    </Suspense>
  )
}