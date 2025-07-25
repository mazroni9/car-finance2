'use client';

import Navigation from "@/components/Navigation";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { NextFont } from 'next/dist/compiled/@next/font';

interface ClientLayoutProps {
  children: React.ReactNode;
  font: NextFont;
}

// إنشاء كاش للـ RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ClientLayout({ children, font }: ClientLayoutProps) {
  // إنشاء ثيم خاص بالتطبيق
  const theme = createTheme({
    direction: 'rtl',
    typography: {
      fontFamily: font.style.fontFamily,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: font.style.fontFamily,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            fontFamily: font.style.fontFamily,
          },
        },
      },
    },
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="glass-card mt-auto p-4">
          <div className="container mx-auto text-center">
            <p className="opacity-80">جميع الحقوق محفوظة © 2025 MAZ Brothers</p>
          </div>
        </footer>
      </ThemeProvider>
    </CacheProvider>
  );
} 