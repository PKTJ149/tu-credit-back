import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const plexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Credit Bank มหาวิทยาลัยธรรมศาสตร์",
  description:
    "เข้าสู่ระบบ Credit Bank มหาวิทยาลัยธรรมศาสตร์ เพื่อจัดการการลงทะเบียน การชำระเงิน และความก้าวหน้าการเรียนรู้",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${plexSansThai.variable} ${plexMono.variable} min-h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)]"
        >
          ข้ามไปยังเนื้อหา
        </a>
        {children}
      </body>
    </html>
  );
}
