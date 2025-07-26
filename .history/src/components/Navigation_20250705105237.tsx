'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <nav className="mx-4 my-2">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                <h1 className="text-2xl font-bold">MAZ Brothers</h1>
              </Link>
              <div className="flex gap-4">
                <Link 
                  href="/" 
                  className={`nav-link ${pathname === '/' ? 'bg-white/10' : ''}`}
                >
                  الرئيسية
                </Link>
                <Link 
                  href="/cars" 
                  className={`nav-link ${pathname === '/cars' ? 'bg-white/10' : ''}`}
                >
                  معرض السيارات
                </Link>
                <Link 
                  href="/admin/car-finance-entry"
                  className={`nav-link ${pathname === '/admin/car-finance-entry' ? 'bg-white/10' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    <span>إدخال تمويل</span>
                    <span className="text-lg">📝</span>
                  </span>
                </Link>
                <Link 
                  href="/car-finance"
                  className={`nav-link ${pathname === '/car-finance' ? 'bg-white/10' : ''}`}
                >
                  حسبة خيالية
                </Link>
                <Link 
                  href="/finance"
                  className={`nav-link ${pathname === '/finance' ? 'bg-white/10' : ''}`}
                >
                  حاسبة التمويل
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`nav-link ${pathname === '/dashboard' ? 'bg-white/10' : ''}`}
                >
                  لوحة التحكم
                </Link>
                <Link 
                  href="/dealer/dashboard" 
                  className={`nav-link ${pathname === '/dealer/dashboard' ? 'bg-white/10' : ''}`}
                >
                  لوحة التاجر
                </Link>
                <Link 
                  href="/reports" 
                  className={`nav-link ${pathname === '/reports' ? 'bg-white/10' : ''}`}
                >
                  التقارير
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="button-secondary">بالعربي</button>
            </div>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .nav-link {
          @apply px-4 py-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors;
        }
        .button-secondary {
          @apply px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors;
        }
      `}</style>
    </header>
  );
}
