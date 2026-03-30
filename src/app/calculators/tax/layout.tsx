import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คำนวณภาษีเงินได้บุคคลธรรมดา 2568/2569 พร้อมรายการลดหย่อนทั้งหมด',
  description: 'โปรแกรมคำนวณภาษีบุคคลธรรมดาของไทย อัปเดตตารางขั้นบันไดล่าสุด รวมถึงรายการลดหย่อนพิเศษเช่น RMF, SSF, Thai ESG และเบี้ยประกัน',
  keywords: ['คำนวณภาษี', 'ลดหย่อนภาษี 2569', 'ภาษี 2568', 'โปรแกรมคำนวณภาษี', 'ยื่นภาษี'],
};

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "โปรแกรมคำนวณภาษีเงินได้บุคคลธรรมดา 2568/2569",
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
