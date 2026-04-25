'use client';
import { MORTGAGE_RATE_INDEX } from '@/data/mortgageRates';
import { useLocale } from 'next-intl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from '../page.module.css';
import { m } from 'framer-motion';

export default function MortgageRateIndexPage() {
  const locale = useLocale();

  const chartData = MORTGAGE_RATE_INDEX.map(p => ({
    date: p.date,
    average: p.averageRate,
    ...Object.fromEntries(p.banks.map(b => [b.name, b.rate]))
  }));

  const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <m.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📉 {locale === 'th' ? 'ดัชนีอัตราดอกเบี้ยบ้านเฉลี่ย' : 'Mortgage Rate Index'}
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {locale === 'th' ? 'ข้อมูลอัตราดอกเบี้ยเฉลี่ยจากธนาคารชั้นนำในไทย อัปเดตรายเดือน' : 'Average mortgage rates from top banks in Thailand, updated monthly.'}
          </m.p>
        </div>

        <m.div
          className={styles.resultPanel}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ width: '100%', maxWidth: '1000px', margin: '2rem auto' }}
        >          <h3>📈 {locale === 'th' ? 'แนวโน้มอัตราดอกเบี้ย (2024-2025)' : 'Interest Rate Trends (2024-2025)'}</h3>
          <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--c-border, rgba(0,0,0,0.05))" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['auto', 'auto']} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(v) => [`${v ?? 0}%`, 'Rate']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10B981' }}
                  name={locale === 'th' ? 'ค่าเฉลี่ยตลาด' : 'Market Average'} 
                />
                {MORTGAGE_RATE_INDEX[0].banks.map((b, i) => (
                  <Line 
                    key={b.name}
                    type="monotone" 
                    dataKey={b.name} 
                    stroke={COLORS[(i + 1) % COLORS.length]} 
                    strokeDasharray="5 5"
                    name={b.name} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem', textAlign: 'center' }}>
            {locale === 'th' ? '* ข้อมูลนี้เป็นเพียงการรวบรวมเพื่อการศึกษาเท่านั้น กรุณาตรวจสอบกับธนาคารอีกครั้ง' : '* This data is for educational purposes only. Please verify with banks.'}
          </p>
        </m.div>

        <div className={styles.layout} style={{ marginTop: '2rem' }}>
          <div className={styles.formPanel}>
            <h3>💡 {locale === 'th' ? 'ทำไมข้อมูลนี้ถึงสำคัญ?' : 'Why this matters?'}</h3>
            <p>
              {locale === 'th' ? 'การติดตามแนวโน้มดอกเบี้ยช่วยให้คุณตัดสินใจ "รีไฟแนนซ์" หรือ "ซื้อบ้าน" ได้ถูกจังหวะมากขึ้น' : 'Tracking interest trends helps you decide when to refinance or buy a home more effectively.'}
            </p>
          </div>
          <div className={styles.formPanel}>
            <h3>🔗 {locale === 'th' ? 'นำไปใช้ในเว็บของคุณ' : 'Use this on your site'}</h3>
            <p>
              {locale === 'th' ? 'คุณสามารถนำกราฟนี้ไปอ้างอิงได้ฟรี เพียงให้เครดิตลิงก์กลับมาที่ Calqly.com' : 'You can reference this chart for free by providing a backlink to Calqly.com.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
