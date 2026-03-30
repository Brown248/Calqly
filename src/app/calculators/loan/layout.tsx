import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คำนวณสินเชื่อบ้าน และตารางผ่อนชำระแบบลดต้นลดดอก (พ.ศ. 2569)',
  description: 'คำนวณค่างวดสินเชื่อบ้าน ผ่อนรถ หรือกู้บุคคล แสดงตารางผ่อนชำระแบบลดต้นลดดอก พร้อมเทคนิคผ่อนเพิ่ม โปะบ้านให้ประหยัดดอกเบี้ย',
  keywords: ['คำนวณสินเชื่อ', 'ดอกเบี้ยบ้าน', 'โปะบ้าน', 'ผ่อนชำระรายเดือน', 'ลดต้นลดดอก', 'รีไฟแนนซ์บ้าน'],
};

export default function LoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "โปรแกรมคำนวณสินเชื่อบ้าน และตารางผ่อนชำระแบบลดต้นลดดอก",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "THB"
            }
          })
        }}
      />
      {children}
    </>
  );
}
