'use client'

import { useLocale } from 'next-intl'
import { LucideIcon, FileText, AlertTriangle, ShieldCheck, Scale, Gavel, Mail } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'

export default function TermsPage() {
  const locale = useLocale()
  const isTh = locale === 'th'

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      <div className="bg-white border-b border-slate-100 pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <BackButton href="/" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight flex items-center gap-3">
                <FileText className="text-teal-600" />
                {isTh ? 'ข้อกำหนดการใช้งาน' : 'Terms of Service'}
              </h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {isTh ? 'อัปเดตล่าสุด: 15 มีนาคม 2026' : 'Last updated: March 15, 2026'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12 bg-orange-50 border border-orange-100 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h3 className="text-lg font-black text-orange-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              {isTh ? 'ข้อสงวนสำคัญ' : 'Important Disclaimer'}
            </h3>
            <p className="text-orange-900/80 font-medium leading-relaxed text-lg">
              {isTh
                ? 'ข้อมูล บทความ และผลการคำนวณทั้งหมดบน CalqlyHub มีไว้เพื่อการศึกษาและข้อมูลเบื้องต้นเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงิน การลงทุน กฎหมาย หรือภาษี'
                : 'All content, articles, and calculations on CalqlyHub are provided for educational and informational purposes only and do not constitute financial, investment, legal, or tax advice.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm prose prose-slate max-w-none">
          {isTh ? <TermsTH /> : <TermsEN />}
        </div>

        <div className="mt-12 bg-slate-800 rounded-[32px] p-8 md:p-10 text-center text-white shadow-2xl shadow-slate-800/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              <Mail size={20} />
              {isTh ? 'ติดต่อเรา' : 'Contact Us'}
            </h3>
            <p className="text-slate-300 font-medium mb-8 leading-relaxed">
              {isTh ? 'หากมีคำถามเกี่ยวกับข้อกำหนดเหล่านี้ ติดต่อเราได้ที่' : 'Questions about these Terms, contact us at'}
            </p>
            <a href="mailto:invioly01@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-800 font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
              invioly01@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

const H2 = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
  <h2 className="text-xl font-black text-slate-800 mt-12 mb-6 flex items-center gap-3">
    <Icon size={20} className="text-teal-500" />
    {children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-600 leading-relaxed mb-6 text-lg">{children}</p>
)

function TermsTH() {
  return (
    <>
      <H2 icon={ShieldCheck}>1. การยอมรับข้อกำหนด</H2>
      <P>การใช้งานเว็บไซต์นี้ถือว่าคุณยอมรับข้อกำหนดการใช้งานฉบับนี้ หากไม่ยอมรับ โปรดหยุดใช้งานเว็บไซต์</P>
      <H2 icon={Scale}>2. ขอบเขตของบริการ</H2>
      <P>CalqlyHub ให้บริการเครื่องมือคำนวณและบทความเชิงให้ความรู้ เว็บไซต์นี้ไม่ได้เป็นสถาบันการเงิน นายหน้า หรือที่ปรึกษาที่ได้รับใบอนุญาต</P>
      <H2 icon={Gavel}>3. การจำกัดความรับผิด</H2>
      <P>ผลการคำนวณเป็นการประมาณการจากข้อมูลที่ผู้ใช้กรอกและสมมติฐานของระบบ ผู้ใช้ควรตรวจสอบข้อมูลกับแหล่งทางการหรือผู้เชี่ยวชาญก่อนตัดสินใจ</P>
    </>
  )
}

function TermsEN() {
  return (
    <>
      <H2 icon={ShieldCheck}>1. Acceptance of Terms</H2>
      <P>By using this website, you agree to these Terms of Service. If you do not agree, please discontinue use.</P>
      <H2 icon={Scale}>2. Scope of Service</H2>
      <P>CalqlyHub provides educational calculators and content. It is not a licensed financial institution, broker, or professional advisory service.</P>
      <H2 icon={Gavel}>3. Limitation of Liability</H2>
      <P>Calculator results are estimates based on user inputs and system assumptions. Users should verify important decisions with official sources or licensed professionals.</P>
    </>
  )
}
