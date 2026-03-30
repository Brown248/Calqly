import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เปรียบเทียบบัตรเครดิตที่ดีที่สุด อัปเดตปี พ.ศ. 2569',
  description: 'เปรียบเทียบบัตรเครดิต Cash Back สะสมแต้ม ผ่อน 0% พร้อมตารางเปรียบเทียบสิทธิพิเศษ เงินเดือนเริ่มต้น 15,000 บาทก็ทำได้',
  keywords: ['เปรียบเทียบบัตรเครดิต', 'บัตรเครดิตเงินคืน', 'บัตรเครดิต 2569', 'สมัครบัตรเครดิต', 'โปรโมชั่นบัตรเครดิต'],
};

export default function CreditCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ระบบเปรียบเทียบบัตรเครดิตที่ดีที่สุด",
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
