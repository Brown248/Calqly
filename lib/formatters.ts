// lib/formatters.ts
// Formatter สำหรับแสดงตัวเลขการเงิน ทั้งภาษาไทยและอังกฤษ

export type Language = 'th' | 'en'

// Format ตัวเลขเป็น currency
export function formatCurrency(
  amount: number,
  lang: Language = 'th',
  currency: string = 'THB'
): string {
  const locale = lang === 'th' ? 'th-TH' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format ตัวเลขทั่วไปมี comma
export function formatNumber(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount)
}

// Format % 
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

// Format เดือน/ปี
export function formatMonths(months: number, lang: Language = 'th'): string {
  if (lang === 'th') {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    const parts: string[] = []
    if (years > 0) parts.push(`${years} ปี`)
    if (remainingMonths > 0) parts.push(`${remainingMonths} เดือน`)
    return parts.join(' ')
  } else {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    const parts: string[] = []
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
    if (remainingMonths > 0) parts.push(`${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`)
    return parts.join(' ')
  }
}

// แปลง string number ที่มี comma ออก
export function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0
}

// คำนวณ reading time
export function calcReadingTime(text: string, lang: Language = 'th'): number {
  const wordsPerMinute = lang === 'th' ? 250 : 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
