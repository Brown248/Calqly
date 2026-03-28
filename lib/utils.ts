// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debounce สำหรับ real-time calculator
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// สร้าง URL params สำหรับ share
export function buildShareUrl(params: Record<string, string | number>): string {
  const url = new URL(window.location.href)
  url.search = ''
  Object.entries(params).forEach(([key, val]) => {
    url.searchParams.set(key, String(val))
  })
  return url.toString()
}

// Parse URL params กลับมาเป็น object
export function parseShareUrl<T extends Record<string, string>>(
  searchParams: URLSearchParams,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {}
  keys.forEach((key) => {
    const val = searchParams.get(key as string)
    if (val !== null) {
      result[key] = val as T[keyof T]
    }
  })
  return result
}

// Format input ขณะพิมพ์ให้มี comma
export function formatInputNumber(value: string): string {
  const num = value.replace(/[^0-9.]/g, '')
  const parts = num.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// ตัดตัวเลขให้ clean
export function sanitizeNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0
}
