'use client'
import { useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="container section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <div
        className="animate-pulse font-black"
        style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--danger-500)' }}
      >
        !
      </div>
      <h1 style={{ color: 'var(--danger-500)', marginBottom: '1rem' }}>{t('title')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
        {t('desc')}
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => reset()} className="btn btn-primary btn-lg">
          {t('retry')}
        </button>
        <Link href="/" className="btn btn-secondary btn-lg">
          {t('go_home')}
        </Link>
      </div>
    </div>
  )
}
