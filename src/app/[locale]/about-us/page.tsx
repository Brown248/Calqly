import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Heart, Mail, Rocket, Target } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'About' })

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('page_title'),
    description: t('page_desc'),
  }
}

export default async function AboutUsPage() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'About' })

  return (
    <div className="min-h-screen bg-[#fcfdfd] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-4xl">
        <BackButton className="mb-10" />
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            <Heart size={14} fill="currentColor" />
            {t('contact_note')}
          </div>
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-slate-800 md:text-6xl">
            {t('header_title')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
            {t('header_subtitle')}
          </p>
        </header>

        <main className="space-y-12">
          <section className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm md:p-12">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-slate-800">
                <Rocket className="text-teal-600" /> {t('start_title')}
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-slate-600">
                <p>
                  <strong className="text-teal-600">CalqlyHub</strong> {t('start_p1')}
                </p>
                <p>{t('start_p2')}</p>
              </div>
            </div>
          </section>

          <section className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm md:p-12">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-50 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-slate-800">
                <Target className="text-blue-600" /> {t('goal_title')}
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-4 text-lg text-slate-600">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">
                      {i}
                    </span>
                    {t(`goal_li${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="contact"
            className="relative overflow-hidden rounded-[40px] bg-slate-800 p-8 text-center text-white shadow-2xl shadow-slate-800/20 md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="mb-6 flex items-center justify-center gap-3 text-3xl font-black">
                <Mail size={28} /> {t('contact_title')}
              </h2>
              <p className="mx-auto mb-10 max-w-md text-lg text-slate-300">{t('contact_desc')}</p>
              <a
                href="mailto:invioly01@gmail.com"
                className="btn inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-lg text-slate-800 shadow-xl transition-all hover:bg-teal-50 hover:text-teal-600"
              >
                <Mail size={20} /> invioly01@gmail.com
              </a>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {t('contact_note')}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
