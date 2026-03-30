'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className={styles.progressBar} style={{ width: `${progress}%` }} />;
}

export function TOC({ article }: { article: any }) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentActive = 0;
      sections.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < 200) currentActive = i;
      });
      setActiveSection(currentActive);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className={styles.toc}>
      <div className={styles.tocSticky}>
        <h4>📑 สารบัญ</h4>
        {article.content.map((section: any, i: number) => (
          <a
            key={i}
            href={`#section-${i}`}
            className={`${styles.tocLink} ${activeSection === i ? styles.tocActive : ''}`}
          >
            {section.heading}
          </a>
        ))}
        <div className={styles.tocDivider} />
        <Link href={article.relatedCalc} className={styles.tocCalc}>
          🧮 ไปใช้เครื่องมือคำนวณ →
        </Link>
      </div>
    </aside>
  );
}
