import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import ClientLayout from '@/components/ClientLayout';
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic"],
  display: 'swap',
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: "نظام تمويل السيارات | MAZ Brothers",
  description: "نظام إدارة تمويل وتقسيط السيارات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <ClientLayout font={cairo}>{children}</ClientLayout>
      </body>
    </html>
  );
}
