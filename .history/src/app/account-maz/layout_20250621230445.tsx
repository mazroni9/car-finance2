'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// إنشاء كاش للـ RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// إنشاء ثيم خاص بالتطبيق
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'var(--font-family)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family)',
        },
      },
    },
  },
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto py-8">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
} 