export default function Loading() {
  return (
    <div 
      className="container section animate-fade-in" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh', 
        textAlign: 'center' 
      }}
    >
      {/* วงกลมหมุนๆ (Spinner) ผสมกับ Emoji */}
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            border: '4px solid var(--border-secondary)',
            borderTopColor: 'var(--primary-500)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite' // เรียกใช้ keyframes spin ใน globals.css
          }}
        />
        <div 
          className="animate-pulse" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem' 
          }}
        >
          💰
        </div>
      </div>

      <h2 className="gradient-text animate-pulse" style={{ marginBottom: '1rem' }}>
        รอแป๊บนึงน้า...
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
        กำลังจัดเตรียมเครื่องมือและคำนวณข้อมูลให้คุณอยู่ครับ ⏳
      </p>
    </div>
  )
}