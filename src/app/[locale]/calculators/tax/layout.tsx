import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TaxCalculator' });
  
  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: `${t('title')} 2569 | CalqlyHub`,
    description: locale === 'th' 
      ? 'คำนวณภาษีเงินได้บุคคลธรรมดา ปี 2569 อัปเดตล่าสุด แม่นยำ 100% พร้อมวางแผนลดหย่อนภาษี SSF, RMF, Thai ESG'
      : 'Calculate personal income tax for 2026. Real-time updates with tax-saving tips for SSF, RMF, and Thai ESG.',
    keywords: ['คำนวณภาษี 2569', 'ลดหย่อนภาษี', 'Tax Calculator Thailand', 'SSF RMF 2569', 'Thai ESG'],
    openGraph: {
      title: `${t('title')} 2569 - CalqlyHub`,
      description: locale === 'th' ? 'เรื่องภาษีจัดการง่ายด้วย CalqlyHub' : 'Simple Tax Management with CalqlyHub',
      images: ['/opengraph-image.png'],
    }
  };
}

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
