import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คำนวณผลตอบแทนการลงทุน (ROI) และลงทุนรายเดือนแบบ DCA',
  description: 'คำนวณผลตอบแทนการลงทุนหุ้น กองทุนรวม แบบทบต้น (CAGR) ด้วยกลยุทธ์เงินก้อนเดี่ยว หรือทยอยลงทุนรายเดือน (DCA)',
  keywords: ['คำนวณ ROI', 'คำนวณ DCA', 'ผลตอบแทนการลงทุน', 'ผลตอบแทนทบต้น', 'CAGR', 'อัตราดอกเบี้ยทบต้น'],
};

export default function ROILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "โปรแกรมคำนวณผลตอบแทนการลงทุน ROI และ DCA",
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
