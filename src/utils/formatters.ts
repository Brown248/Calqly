/**
 * Number and currency formatting utilities for Thai Finance Hub
 */

export function formatCurrency(amount: number, locale: string = 'th-TH'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFull(amount: number, locale: string = 'th-TH'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, locale: string = 'th-TH'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumberWithDecimals(num: number, decimals: number = 2, locale: string = 'th-TH'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

export function formatCompact(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

export function formatThaiCompact(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} ล้าน`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(0)} แสน`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(0)} หมื่น`;
  }
  return formatNumber(num);
}

export function parseInputNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
