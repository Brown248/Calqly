import Link from 'next/link';
import type { Metadata } from 'next';
import { ARTICLES } from '@/data/articles';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'บทความการเงิน — CalqlyHub',
  description: 'บทความอธิบายเรื่องการเงินให้เข้าใจง่าย ภาษี สินเชื่อ วางแผนเกษียณ การลงทุน อิงข้อมูลปี 2569',
};

export default function ArticlesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📚 บทความ<span className={styles.accent}>อธิบายง่ายๆ</span></h1>
          <p>เรื่องการเงินที่ซับซ้อน อธิบายให้เข้าใจใน 5 นาที อิงข้อมูลปี พ.ศ. 2569</p>
        </div>
        <div className={styles.grid}>
          {ARTICLES.map((article, i) => (
            <Link href={`/articles/${article.slug}`} key={i} className={styles.card}>
              <div className={styles.cardIcon}>{article.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.badge}>{article.category}</span>
                  <span className={styles.readTime}>⏱ อ่าน {article.readTime} นาที</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className={styles.cardAction}>อ่านบทความ →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
