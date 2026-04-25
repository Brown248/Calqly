import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RealCostCalculator' });
  
  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: `${t('title')} | CalqlyHub`,
    description: locale === 'th' 
      ? 'คำนวณราคาที่จ่ายจริง รวมดอกเบี้ย ค่าดูแลรักษา และค่าเสียโอกาส เพื่อเปิดเผยต้นทุนที่แท้จริงของสิ่งของที่คุณจะซื้อ'
      : 'Calculate the true cost of any purchase including interest, maintenance, and opportunity cost to reveal the real price of ownership.',
    keywords: locale === 'th' 
      ? ['ราคาที่จ่ายจริง', 'ค่าเสียโอกาส', 'ต้นทุนที่แท้จริง', 'คำนวณค่าใช้จ่าย', 'Real Cost Calculator']
      : ['Real Cost Calculator', 'Opportunity Cost', 'True Cost of Ownership', 'Financial Planning'],
    openGraph: {
      title: `${t('title')} - CalqlyHub`,
      description: locale === 'th' ? 'เปิดเผยราคาที่จ่ายจริงของทุกการซื้อ' : 'Reveal the true cost of every purchase',
      images: ['/opengraph-image.png'],
    }
  };
}

export default function RealCostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
