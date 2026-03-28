import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Thai CalqlyHub — เครื่องมือคำนวณการเงินส่วนบุคคล",
  description:
    "คำนวณภาษี สินเชื่อ วางแผนเกษียณ เช็ค ROI เปรียบเทียบบัตรเครดิต พร้อมบทความอธิบายการเงินง่ายๆ สำหรับคนไทย",
  keywords:
    "คำนวณภาษี, สินเชื่อบ้าน, วางแผนเกษียณ, ROI, บัตรเครดิต, การเงินส่วนบุคคล",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" data-theme="light" suppressHydrationWarning>
      <body data-gr-ext-installed="">
        <ThemeProvider>
          <Header />
          <main style={{ paddingTop: "var(--header-height)", minHeight: "100vh" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}