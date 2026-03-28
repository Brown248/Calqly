'use client' // Error components ต้องเป็น Client Component
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="container section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="animate-pulse" style={{ fontSize: '5rem', marginBottom: '1rem' }}>
        🛠️
      </div>
      <h1 style={{ color: 'var(--danger-500)', marginBottom: '1rem' }}>แงะ... เกิดข้อผิดพลาดทางเทคนิค</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
        ระบบของเราอาจจะทำงานหนักไปนิด หรือมีบางอย่างขัดข้อง ไม่ต้องห่วงครับ ลองโหลดใหม่อีกครั้งนะ
      </p>
      <button onClick={() => reset()} className="btn btn-primary btn-lg">
        ลองใหม่อีกครั้ง
      </button>
    </div>
  )
}