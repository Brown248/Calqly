'use client'

import { useEffect, useState } from 'react'
import { trackArticleRead } from '@/lib/analytics'

interface ReadingProgressProps {
  articleSlug: string
}

export function ReadingProgress({ articleSlug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const tracked = new Set<number>()

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

      setProgress(percent)

      // Track milestones
      for (const milestone of [25, 50, 75, 100]) {
        if (percent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone)
          trackArticleRead(articleSlug, milestone)
        }
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [articleSlug])

  return (
    <div
      className="progress-bar"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
