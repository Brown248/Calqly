'use client';
import { useState } from 'react';
import { CREDIT_CARDS, CARD_TYPES } from '@/data/creditCards';
import { formatNumber } from '@/utils/formatters';
import styles from './page.module.css';

export default function CreditCardsPage() {
  const [filter, setFilter] = useState('all');
  const [compare, setCompare] = useState<string[]>([]);
  const [minIncome, setMinIncome] = useState(0);

  const filtered = CREDIT_CARDS.filter(c => {
    if (filter !== 'all' && c.type !== filter) return false;
    if (minIncome > 0 && c.minIncome > minIncome) return false;
    return true;
  });

  const toggleCompare = (id: string) => {
    setCompare(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const compareCards = CREDIT_CARDS.filter(c => compare.includes(c.id));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>💳 เปรียบเทียบ<span className={styles.accent}>บัตรเครดิต</span></h1>
          <p>เปรียบเทียบบัตรเครดิตจากธนาคารชั้นนำ เลือกให้เหมาะกับไลฟ์สไตล์ของคุณ</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterTabs}>
            {CARD_TYPES.map(t => (
              <button key={t.id} className={`${styles.filterBtn} ${filter === t.id ? styles.filterActive : ''}`} onClick={() => setFilter(t.id)}>{t.name}</button>
            ))}
          </div>
          <div className={styles.incomeFilter}>
            <label>รายได้ขั้นต่ำ</label>
            <select className="input-field" value={minIncome} onChange={e => setMinIncome(+e.target.value)}>
              <option value={0}>ทั้งหมด</option>
              <option value={15000}>15,000+</option>
              <option value={30000}>30,000+</option>
              <option value={50000}>50,000+</option>
            </select>
          </div>
        </div>

        {/* Card Grid */}
        <div className={styles.cardGrid}>
          {filtered.map(card => (
            <div key={card.id} className={styles.creditCard}>
              <div className={styles.cardHeader} style={{background: card.gradient}}>
                <div className={styles.cardName}>{card.name}</div>
                <div className={styles.cardBank}>{card.bank}</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardDetail}><span>ค่าธรรมเนียม</span><strong>{card.annualFee === 0 ? 'ฟรี!' : `${formatNumber(card.annualFee)} บาท/ปี`}</strong></div>
                <div className={styles.cardDetail}><span>ยกเว้นค่าธรรมเนียม</span><strong>{card.feeWaiver}</strong></div>
                <div className={styles.cardDetail}><span>รายได้ขั้นต่ำ</span><strong>{formatNumber(card.minIncome)} บาท/เดือน</strong></div>
                <div className={styles.cardDetail}><span>Cashback/Points</span><strong>{card.cashbackRate}</strong></div>
                <div className={styles.benefitsList}>
                  <span>สิทธิพิเศษ:</span>
                  <ul>{card.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                </div>
                <button
                  className={`${styles.compareBtn} ${compare.includes(card.id) ? styles.compareBtnActive : ''}`}
                  onClick={() => toggleCompare(card.id)}
                >
                  {compare.includes(card.id) ? '✓ เลือกแล้ว' : '+ เปรียบเทียบ'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Compare Panel */}
        {compareCards.length >= 2 && (
          <div className={styles.compareSection}>
            <h3>📊 เปรียบเทียบ {compareCards.length} บัตร</h3>
            <div className={styles.compareTable}>
              <table className="data-table">
                <thead>
                  <tr><th>รายการ</th>{compareCards.map(c => <th key={c.id}>{c.name}</th>)}</tr>
                </thead>
                <tbody>
                  <tr><td>ธนาคาร</td>{compareCards.map(c => <td key={c.id}>{c.bank}</td>)}</tr>
                  <tr><td>ค่าธรรมเนียม</td>{compareCards.map(c => <td key={c.id}>{c.annualFee === 0 ? 'ฟรี' : `${formatNumber(c.annualFee)}`}</td>)}</tr>
                  <tr><td>รายได้ขั้นต่ำ</td>{compareCards.map(c => <td key={c.id}>{formatNumber(c.minIncome)}</td>)}</tr>
                  <tr><td>Cashback</td>{compareCards.map(c => <td key={c.id}>{c.cashbackRate}</td>)}</tr>
                  <tr><td>Points</td>{compareCards.map(c => <td key={c.id}>{c.pointsRate}</td>)}</tr>
                  <tr><td>สิทธิพิเศษ</td>{compareCards.map(c => <td key={c.id}><ul className={styles.compList}>{c.benefits.map((b,i)=><li key={i}>{b}</li>)}</ul></td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
