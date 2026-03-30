import Link from 'next/link';
import { ARTICLES } from '@/data/articles';
import styles from './page.module.css';
import { ProgressBar, TOC } from './ArticleClientSide';

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return { title: 'ไม่พบบทความ' };
  return {
    title: `${article.title} | Calqly`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className={styles.page}><div className={styles.container}>
        <h1>ไม่พบบทความ</h1><p>บทความที่คุณค้นหาไม่มีอยู่ในระบบ</p>
        <Link href="/articles" className="btn btn-primary">← กลับไปหน้าบทความ</Link>
      </div></div>
    );
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": ["https://calqlyhub.com/opengraph-image.png"],
            "datePublished": "2026-03-30T00:00:00+07:00",
            "author": [{
              "@type": "Organization",
              "name": "CalqlyHub",
              "url": "https://calqlyhub.com"
            }]
          })
        }}
      />
      <ProgressBar />
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* TOC Sidebar */}
          <TOC article={article} />

          {/* Article Content */}
          <article className={styles.article}>
            <div className={styles.articleHeader}>
              <div className={styles.articleMeta}>
                <span className={styles.badge}>{article.category}</span>
                <span>⏱ อ่าน {article.readTime} นาที</span>
                <span>📅 {article.date}</span>
              </div>
              <h1>{article.icon} {article.title}</h1>
              <p className={styles.excerpt}>{article.excerpt}</p>
            </div>

            {article.content.map((section: any, i: number) => (
              <section key={i} id={`section-${i}`} data-section className={styles.section}>
                <h2>{section.heading}</h2>
                {section.body.split('\n\n').map((para: string, j: number) => (
                  <div key={j} className={styles.paragraph}>
                    {para.split('\n').map((line: string, k: number) => (
                      <p key={k}>{line}</p>
                    ))}
                  </div>
                ))}
              </section>
            ))}

            {/* Related Calc CTA */}
            <div className={styles.ctaCard}>
              <h3>🧮 ลองคำนวณด้วยตัวเอง</h3>
              <p>ใช้เครื่องมือคำนวณของเราเพื่อวางแผนการเงินจากข้อมูลในบทความนี้</p>
              <Link href={article.relatedCalc} className="btn btn-primary btn-lg">เริ่มคำนวณเลย →</Link>
            </div>

            {/* Disclaimer */}
            <div className={styles.disclaimer}>
              ⚠️ <strong>คำเตือน:</strong> บทความนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงินหรือภาษี ข้อมูลอ้างอิงจากกรมสรรพากร ธนาคารแห่งประเทศไทย และแหล่งที่น่าเชื่อถือ อาจมีการเปลี่ยนแปลง
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
