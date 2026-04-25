'use client'

import { useLocale } from 'next-intl'
import { Mail, Lock, Shield, Eye, Scale } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'

export default function PrivacyPage() {
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
                <Lock className="text-teal-600" />
                {isTh ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
              </h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {isTh ? 'มีผลบังคับใช้: 1 มกราคม 2025 · อัปเดตล่าสุด: 15 มีนาคม 2026' : 'Effective: January 1, 2025 · Last updated: March 15, 2026'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm prose prose-slate max-w-none">
          {isTh ? <PrivacyTH /> : <PrivacyEN />}
        </div>

        <div className="mt-12 bg-teal-50 border border-teal-100 rounded-[32px] p-8 md:p-10 text-center">
          <h3 className="text-lg font-black text-teal-800 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <Mail size={20} />
            {isTh ? 'ติดต่อเรา' : 'Contact Us'}
          </h3>
          <p className="text-teal-700 font-medium mb-8 leading-relaxed max-w-md mx-auto">
            {isTh ? 'หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว หรืออยากใช้สิทธิตาม PDPA ติดต่อเราได้ที่' : 'For privacy questions or to exercise your PDPA rights, contact us at'}
          </p>
          <a href="mailto:invioly01@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-teal-600 font-bold shadow-lg shadow-teal-600/10 hover:scale-105 active:scale-95 transition-all">
            invioly01@gmail.com
          </a>
        </div>
      </main>
    </div>
  )
}

const H2 = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <h2 className="text-xl font-black text-slate-800 mt-12 mb-6 flex items-center gap-3">
    <Icon size={20} className="text-teal-500" />
    {children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-600 leading-relaxed mb-6 text-lg">{children}</p>
)

const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="text-slate-600 leading-relaxed mb-3 text-lg">{children}</li>
)

function PrivacyTH() {
  return (
    <>
      <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl mb-10 border border-emerald-100 font-medium leading-relaxed">
        <strong>สรุปสั้นๆ:</strong> เราเก็บข้อมูลการใช้งานแบบไม่ระบุตัวตนผ่านเครื่องมือวิเคราะห์ เก็บค่าคุกกี้ที่คุณเลือกไว้ในเบราว์เซอร์ และไม่ขายข้อมูลส่วนบุคคลของคุณ
      </div>
      <H2 icon={Shield}>1. ผู้ควบคุมข้อมูลส่วนบุคคล</H2>
      <P>CalqlyHub เป็นเว็บไซต์ให้ข้อมูลและเครื่องมือคำนวณทางการเงินสำหรับผู้ใช้งานในประเทศไทย เราทำหน้าที่เป็นผู้ควบคุมข้อมูลส่วนบุคคลตามกฎหมาย PDPA เท่าที่เกี่ยวข้องกับบริการนี้</P>
      <H2 icon={Eye}>2. ข้อมูลที่เราเก็บรวบรวม</H2>
      <ul className="list-none p-0 space-y-4">
        <Li><strong>ข้อมูลการใช้งาน:</strong> หน้าที่เข้าชม ระยะเวลาโดยประมาณ ประเทศ และประเภทอุปกรณ์ ในรูปแบบไม่ระบุตัวตน</Li>
        <Li><strong>ค่าการตั้งค่า:</strong> สถานะการยินยอมคุกกี้และค่าที่คุณเลือก เก็บไว้ในเบราว์เซอร์ของคุณ</Li>
        <Li><strong>ข้อมูลโฆษณา:</strong> หากคุณยินยอม อาจมีการใช้คุกกี้เพื่อแสดงโฆษณาที่เกี่ยวข้องมากขึ้น</Li>
      </ul>
      <P><strong>เราไม่เก็บ</strong> ชื่อ อีเมล หมายเลขโทรศัพท์ หรือข้อมูลการเงินส่วนบุคคลที่สามารถระบุตัวตนของคุณได้โดยตรงจากเครื่องคิดเลข</P>
      <H2 icon={Scale}>3. สิทธิของคุณตาม PDPA</H2>
      <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
        <Li>สิทธิในการเข้าถึงข้อมูล</Li>
        <Li>สิทธิในการถอนความยินยอมเกี่ยวกับคุกกี้</Li>
        <Li>สิทธิในการร้องขอให้ลบหรือแก้ไขข้อมูลในส่วนที่กฎหมายรองรับ</Li>
      </ul>
    </>
  )
}

function PrivacyEN() {
  return (
    <>
      <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl mb-10 border border-emerald-100 font-medium leading-relaxed">
        <strong>Summary:</strong> We collect anonymized usage data, store your cookie preferences in your browser, and do not sell your personal information.
      </div>
      <H2 icon={Shield}>1. Data Controller</H2>
      <P>CalqlyHub operates as a financial education and calculator website for users in Thailand. We act as the data controller to the extent required by the PDPA.</P>
      <H2 icon={Eye}>2. Data We Collect</H2>
      <ul className="list-none p-0 space-y-4">
        <Li><strong>Usage data:</strong> Pages visited, approximate session duration, country, and device type in anonymized form.</Li>
        <Li><strong>Preferences:</strong> Cookie consent choices stored in your browser.</Li>
        <Li><strong>Advertising data:</strong> If you consent, advertising cookies may be used to personalize ads.</Li>
      </ul>
      <P><strong>We do not collect</strong> your name, phone number, email address, or personally identifiable financial data from calculator inputs.</P>
      <H2 icon={Scale}>3. Your Rights Under PDPA</H2>
      <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
        <Li>Right to access your data</Li>
        <Li>Right to withdraw cookie consent</Li>
        <Li>Right to request deletion or correction where legally applicable</Li>
      </ul>
    </>
  )
}
