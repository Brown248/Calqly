# FinWise.th — Finance Calculator + Explained Simply Site

เว็บไซต์คำนวณการเงินและบทความให้ความรู้ทางการเงิน สร้างด้วย Next.js 14

## Project Structure

```
finwise-th/
├── app/
│   ├── layout.tsx                  ← Root layout (GA4 + AdSense script ใส่ที่นี่)
│   ├── page.tsx                    ← Homepage
│   ├── globals.css                 ← Global styles
│   ├── sitemap.ts                  ← Auto SEO sitemap
│   ├── robots.ts                   ← robots.txt
│   ├── calculators/
│   │   ├── page.tsx                ← Calculators listing
│   │   └── [slug]/
│   │       ├── page.tsx            ← Static params + SEO metadata
│   │       └── CalculatorPageClient.tsx  ← Client layout (Header/Footer/Ads)
│   └── articles/
│       ├── page.tsx                ← Articles listing
│       └── [slug]/
│           └── page.tsx            ← Article detail + Reading Progress
│
├── components/
│   ├── ads/
│   │   └── AdUnit.tsx              ← AdSense wrapper (dev mock included)
│   ├── layout/
│   │   ├── Header.tsx              ← Sticky header + lang switcher + dark mode
│   │   └── Footer.tsx              ← Footer + disclaimer
│   ├── calculators/
│   │   ├── LoanCalculator.tsx      ← สินเชื่อ + amortization table
│   │   ├── TaxCalculator.tsx       ← ภาษีเงินได้ + bracket breakdown
│   │   └── RetirementCalculator.tsx ← เกษียณ + projection chart
│   ├── articles/
│   │   └── ReadingProgress.tsx     ← Progress bar + GA4 milestone tracking
│   └── ui/
│       └── ShareButton.tsx         ← Share/Copy/Print buttons
│
├── lib/
│   ├── analytics.ts                ← GA4 event helpers
│   ├── calculators.ts              ← Business logic (แยกจาก UI)
│   ├── formatters.ts               ← Number/currency/date formatters
│   └── utils.ts                    ← cn(), debounce, URL helpers
│
└── .env.example                    ← Template สำหรับ env vars
```

## Quick Start

```bash
# 1. Clone / download project
# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# แก้ไข .env.local ใส่ GA ID และ AdSense Client ID

# 4. Run dev server
npm run dev
```

## Environment Variables

| Variable | ที่มา | จำเป็น |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | ✓ |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense | ✓ |
| `NEXT_PUBLIC_AD_SLOT_*` | AdSense Console (สร้างแต่ละ slot) | ✓ |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFY` | Search Console | ✓ |
| `NEXT_PUBLIC_SITE_URL` | Domain จริง | ✓ |

## Deploy บน Vercel (ฟรี)

```bash
npm install -g vercel
vercel --prod
# ใส่ env vars ใน Vercel Dashboard → Settings → Environment Variables
```

## การเพิ่ม Calculator ใหม่

1. เพิ่ม logic ใน `lib/calculators.ts`
2. สร้าง component ใน `components/calculators/YourCalculator.tsx`
3. เพิ่ม entry ใน `CALCULATORS` array ใน `lib/calculators.ts`
4. Register component ใน `app/calculators/[slug]/CalculatorPageClient.tsx`

## การเพิ่มบทความใหม่

ใน production แนะนำให้ใช้ MDX:

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

แล้วสร้างไฟล์ `content/articles/your-slug.mdx`

## Ad Placement Strategy

| Position | Component | RPM |
|---|---|---|
| Header (Leaderboard) | `<AdLeaderboard />` | ต่ำ |
| กลางหน้า (Rectangle) | `<AdRectangle />` | สูง ⭐ |
| ใน Content | `<AdInContent />` | สูงมาก ⭐⭐ |
| Sidebar (Vertical) | `<AdSidebar />` | ปานกลาง |

**เคล็ดลับ**: In-content และ Rectangle ads ให้ RPM สูงที่สุด เพราะอยู่ใกล้ content ที่ user กำลังอ่าน

## Google Analytics Events ที่ Track อัตโนมัติ

- `calculator_use` — ทุกครั้งที่ใช้ calculator
- `share` — เมื่อ copy URL
- `scroll` — milestone 25/50/75/100% ของบทความ
- `language_switch` — เมื่อเปลี่ยนภาษา
- `print` — เมื่อกด print
