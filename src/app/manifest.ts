import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalqlyHub - Smart Financial Planner',
    short_name: 'CalqlyHub',
    description: 'Precision financial calculators for tax, loans, and personal wealth planning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfdfd',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait',
    scope: '/',
  }
}
