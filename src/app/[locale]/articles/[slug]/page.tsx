import { Link } from '@/i18n/routing'
import Script from 'next/script'
import { AlertTriangle, ChevronLeft, Clock, ShieldCheck, User, RefreshCw } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import SectionReveal from '@/components/animations/SectionReveal'
import { getArticles, ArticleSection } from '@/data/articles'
import {
  AffiliateManager,
  ArticleBackButton,
  ProgressBar,
  TOC,
} from './ArticleClientSide'

export async function generateStaticParams() {
  const th = getArticles('th').map((a) => ({ locale: 'th', slug: a.slug }))
  const en = getArticles('en').map((a) => ({ locale: 'en', slug: a.slug }))
  return [...th, ...en]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const articles = getArticles(locale)
  const article = articles.find((a) => a.slug === slug)
  const t = await getTranslations({ locale, namespace: 'Articles' })

  if (!article) {
    return { title: t('not_found') }
  }

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: `${article.title} | Calqly`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const articles = getArticles(locale)
  const article = articles.find((a) => a.slug === slug)
  const t = await getTranslations({ locale, namespace: 'Articles' })

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pb-20 pt-40">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-black text-slate-800">{t('not_found')}</h1>
          <p className="mb-8 text-slate-500">{t('not_found_desc')}</p>
          <Link href="/articles" className="btn btn-primary px-8 py-4">
            <ChevronLeft size={20} className="mr-2" />
            {t('back_to_articles')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      <Script
        id={`article-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            image: ['https://calqlyhub.com/opengraph-image.png'],
            datePublished: article.date.replace('2569', '2026').replace('2568', '2025'),
            dateModified: article.lastUpdated.replace('2569', '2026').replace('2568', '2025'),
            author: [
              {
                '@type': 'Person',
                name: article.author.name,
                jobTitle: article.author.role,
                url: 'https://calqlyhub.com',
              },
            ],
          }),
        }}
      />
      <ProgressBar />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="flex flex-col gap-12 lg:flex-row">
          <TOC article={article} />

          <article className="max-w-3xl flex-1">
            <header className="mb-12">
              <ArticleBackButton />

              <div className="mb-8 flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-widest">
                <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-teal-600">
                  {article.category}
                </span>
                
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={14} /> {t('read_time', { time: article.readTime })}
                </span>
                
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-500">
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span className="opacity-60">{locale === 'th' ? 'อัปเดต:' : 'Updated:'}</span>
                  <span>
                    {locale === 'th'
                      ? article.lastUpdated
                      : article.lastUpdated.replace('2569', '2026').replace('2568', '2025')}
                  </span>
                </span>
              </div>

              <h1 className="mb-8 text-4xl font-black leading-tight tracking-tight text-slate-800 md:text-5xl">
                {article.icon} {article.title}
              </h1>

              {/* Author Profile Card */}
              <div className="mb-10 flex items-center gap-5 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                  <User size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-800">{article.author.name}</span>
                    {article.author.verified && (
                      <div className="group relative flex items-center text-teal-500">
                        <ShieldCheck size={18} fill="currentColor" className="text-white" />
                        <ShieldCheck size={18} className="absolute inset-0" />
                        <span className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                          {locale === 'th' ? 'ผ่านการตรวจสอบแล้ว' : 'Verified Expert'}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">{article.author.role}</p>
                </div>
              </div>

              <p className="border-l-4 border-teal-500/20 pl-6 text-xl font-medium leading-relaxed text-slate-500">
                {article.excerpt}
              </p>
            </header>

            <div className="prose prose-slate max-w-none prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-black prose-h2:text-slate-800 prose-p:mb-6 prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600">
              {article.content.map((section: ArticleSection, i: number) => (
                <SectionReveal
                  key={i}
                  id={`section-${i}`}
                  delay={i * 0.05}
                  className="mb-12"
                >
                  <h2 className="mb-6 mt-12 text-2xl font-black text-slate-800">
                    {section.heading}
                  </h2>
                  {section.body.split('\n\n').map((para: string, j: number) => (
                    <div key={j} className="mb-6">
                      {para.split('\n').map((line: string, k: number) => (
                        <p key={k} className="mb-4 text-lg leading-relaxed text-slate-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </SectionReveal>
              ))}
            </div>

            <div className="my-16">
              <AffiliateManager article={article} />
            </div>

            <div className="group relative mt-16 overflow-hidden rounded-[40px] bg-gradient-to-br from-teal-600 to-emerald-500 p-8 text-white shadow-2xl shadow-teal-600/20 md:p-12">
              <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />
              <div className="relative z-10">
                <h3 className="mb-4 text-3xl font-black">{t('try_calc')}</h3>
                <p className="mb-8 max-w-md text-lg text-teal-50 opacity-90">
                  {t('try_calc_desc')}
                </p>
                <Link
                  href={article.relatedCalc}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-teal-600 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  {t('start_calc')}
                </Link>
              </div>
            </div>

            <div className="mt-12 flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <AlertTriangle className="shrink-0 text-amber-500" size={24} />
              <div>
                <h4 className="mb-1 text-sm font-black uppercase tracking-wider text-slate-800">
                  {t('disclaimer_title')}
                </h4>
                <p className="text-sm leading-relaxed text-slate-500">
                  {t('disclaimer_text')}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
