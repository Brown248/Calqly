'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ARTICLES } from '@/data/articles';
import styles from './page.module.css';

export default function ArticleClientSide({ slug }: { slug: string }) {
  const article = ARTICLES.find(a => a.slug === slug);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      // Track active section
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < 200) setActiveSection(i);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* TOC Sidebar */}
          <aside className={styles.toc}>
            <div className={styles.tocSticky}>
              <h4>📑 สารบัญ</h4>
              {article.content.map((section, i) => (
                <a key={i} href={`#section-${i}`} className={`${styles.tocLink} ${activeSection === i ? styles.tocActive : ''}`}>
                  {section.heading}
                </a>
              ))}
              <div className={styles.tocDivider} />
              <Link href={article.relatedCalc} className={styles.tocCalc}>
                🧮 ไปใช้เครื่องมือคำนวณ →
              </Link>
            </div>
          </aside>

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

            {article.content.map((section, i) => (
              <section key={i} id={`section-${i}`} data-section className={styles.section}>
                <h2>{section.heading}</h2>
                {section.body.split('\n\n').map((para, j) => (
                  <div key={j} className={styles.paragraph}>
                    {para.split('\n').map((line, k) => (
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
