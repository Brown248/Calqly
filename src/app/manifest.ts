import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalqlyHub — คำนวณการเงิน',
    short_name: 'CalqlyHub',
    description: 'เครื่องคิดเลขการเงิน สินเชื่อ ภาษี และวางแผนเกษียณ ใช้งานฟรี',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f6f2',
    theme_color: '#2d7a5f',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
