import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export สำหรับ deploy บน Vercel / Cloudflare Pages
  // ลบ output: 'export' ออกถ้าต้องการ SSR
  
  // Headers สำหรับ AdSense และ Analytics
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Rewrites สำหรับ i18n แบบไม่ใช้ sub-path
  async rewrites() {
    return []
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // เปิด compression
  compress: true,

  // PoweredBy header ปิดไว้
  poweredByHeader: false,
}

export default nextConfig
