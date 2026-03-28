import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="animate-float" style={{ fontSize: '6rem', marginBottom: '1rem' }}>
        🛸
      </div>
      <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>404 - หลงทางหรือเปล่าเอ่ย?</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
        ดูเหมือนว่าหน้าที่คุณกำลังตามหาจะถูกย้ายไปแล้ว หรืออาจจะไม่มีอยู่จริง ลองกลับไปเริ่มต้นใหม่ที่หน้าหลักนะครับ 
      </p>
      <Link href="/" className="btn btn-primary btn-lg animate-fade-in-up">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  )
}