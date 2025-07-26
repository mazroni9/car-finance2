import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import ClientLayout from './client-layout';
import "./globals.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

const cairo = Cairo({ 
  subsets: ["arabic"],
  display: 'swap',
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: "نظام تمويل السيارات | MAZ Brothers",
  description: "نظام إدارة تمويل وتقسيط السيارات",
};

// إنشاء كاش للـ RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// إنشاء ثيم خاص بالتطبيق
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: cairo.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: cairo.style.fontFamily,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: cairo.style.fontFamily,
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <ClientLayout font={cairo}>{children}</ClientLayout>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
