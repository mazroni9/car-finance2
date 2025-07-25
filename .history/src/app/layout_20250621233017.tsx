import { Cairo } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic"],
  display: 'swap',
  adjustFontFallback: false
});

export const metadata = {
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
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="glass-card mt-auto p-4">
          <div className="container mx-auto text-center">
            <p className="opacity-80">جميع الحقوق محفوظة © 2025 MAZ Brothers</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
