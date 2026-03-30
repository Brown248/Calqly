import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เครื่องมือวางแผนเกษียณ (Retirement Calculator) และกฎ 4%',
  description: 'วิเคราะห์อายุที่สามารถเกษียณได้ เงินออมที่เพียงพอสำหรับการใช้ชีวิตในยุคเงินเฟ้อ และกฎ 4% (4% Rule) สำหรับเงินบำนาญ',
  keywords: ['วางแผนเกษียณ', 'เกษียณอายุ', 'กฎ 4เปอร์เซ็น', 'เงินออมเกษียณ', 'อิสรภาพทางการเงิน', 'FIRE movement'],
};

export default function RetirementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "โปรแกรมคำนวณวางแผนเกษียณ (กบข./กองทุน/เกษียณอายุ)",
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
