// ============================================================
// src/components/FinancialDisclaimer.tsx
// ใส่ไว้ในทุกหน้า calculator — ตาม พ.ร.บ.หลักทรัพย์ฯ
// ============================================================

interface Props {
  lang?: 'th' | 'en'
  source?: string       // แหล่งข้อมูลที่อ้างอิง เช่น "กรมสรรพากร"
  sourceUrl?: string    // URL ของแหล่งข้อมูล
  updatedDate?: string  // วันที่อัปเดตข้อมูลล่าสุด
  compact?: boolean     // แบบย่อสำหรับพื้นที่แคบ
}

export function FinancialDisclaimer({
  lang = 'th',
  source,
  sourceUrl,
  updatedDate,
  compact = false,
}: Props) {
  const t = {
    th: {
      warning: 'ข้อมูลเพื่อการศึกษาเท่านั้น',
      body: 'ผลการคำนวณเป็นการประมาณการ ไม่ใช่คำแนะนำทางการเงิน กรุณาปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจ',
      bodyFull: 'ผลการคำนวณและข้อมูลทั้งหมดบนหน้านี้มีวัตถุประสงค์เพื่อการศึกษาและเป็นการประมาณการเบื้องต้นเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงิน การลงทุน หรือภาษีแต่อย่างใด กรุณาปรึกษาผู้เชี่ยวชาญที่มีใบอนุญาตก่อนตัดสินใจทางการเงินที่สำคัญทุกครั้ง',
      sourceLabel: 'ข้อมูลอ้างอิง:',
      updated: 'อัปเดต:',
    },
    en: {
      warning: 'For educational purposes only',
      body: 'Results are estimates, not financial advice. Consult a licensed professional before making decisions.',
      bodyFull: 'All calculations and information on this page are for educational purposes only and are estimates only. They do not constitute financial, investment, or tax advice. Always consult a licensed professional before making important financial decisions.',
      sourceLabel: 'Source:',
      updated: 'Updated:',
    },
  }[lang]

  if (compact) {
    return (
      <p style={{
        fontSize: '0.725rem',
        color: 'var(--c-text-3, #7a7a70)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.3rem',
        margin: '0.875rem 0 0',
        lineHeight: 1.5,
      }}>
        <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚠</span>
        <span>{t.body}</span>
        {source && sourceUrl && (
          <span style={{ marginLeft: 4 }}>
            {t.sourceLabel}{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--c-primary, #2d7a5f)', fontWeight: 600 }}>
              {source}
            </a>
          </span>
        )}
      </p>
    )
  }

  return (
    <div style={{
      background: '#fffbeb',
      border: '1px solid rgba(245,158,11,0.25)',
      borderLeft: '3px solid #f59e0b',
      borderRadius: '0 0.75rem 0.75rem 0',
      padding: '0.875rem 1rem',
      marginTop: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }}>⚠️</span>
        <div>
          <p style={{
            fontSize: '0.775rem',
            fontWeight: 700,
            color: '#92400e',
            marginBottom: '0.25rem',
          }}>
            {t.warning}
          </p>
          <p style={{
            fontSize: '0.775rem',
            color: '#78350f',
            lineHeight: 1.65,
            margin: 0,
          }}>
            {t.bodyFull}
          </p>

          {(source || updatedDate) && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '0.5rem',
              fontSize: '0.72rem',
              color: '#92400e',
            }}>
              {source && (
                <span>
                  📌 {t.sourceLabel}{' '}
                  {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--c-primary, #2d7a5f)', fontWeight: 600, textDecoration: 'none' }}>
                      {source} ↗
                    </a>
                  ) : (
                    <strong>{source}</strong>
                  )}
                </span>
              )}
              {updatedDate && (
                <span>🗓 {t.updated} {updatedDate}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
