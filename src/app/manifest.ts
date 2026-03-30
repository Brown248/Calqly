import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calqly - เครื่องมือคำนวณการเงิน',
    short_name: 'Calqly',
    description: 'เครื่องมือคำนวณการเงิน ภาษี สินเชื่อส่วนบุคคล สำหรับคนไทย',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10B981', // Emerald theme default
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
