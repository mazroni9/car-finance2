'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#121212]">
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
                  href="/trader-finance"
                  className={`nav-link ${pathname === '/trader-finance' ? 'bg-white/10' : ''}`}
                >
                  تمويل التجار
                </Link>
                <Link 
                  href="/car-finance"
                  className={`nav-link ${pathname === '/car-finance' ? 'bg-white/10' : ''}`}
                >
                  نظام التأجير
                </Link>
                <Link 
                  href="/finance"
                  className={`nav-link ${pathname === '/finance' ? 'bg-white/10' : ''}`}
                >
                  حاسبة التمويل
                </Link>
                <Link 
                  href="/showroom-mazbrothers" 
                  className={`nav-link ${pathname === '/showroom-mazbrothers' ? 'bg-white/10' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🏬</span>
                    <span>mazbrothers</span>
                  </span>
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
                <Link 
                  href="/dashboard" 
                  className={`nav-link ${pathname === '/dashboard' ? 'bg-white/10' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    <span>Admin</span>
                    <span className="text-lg">⚙️</span>
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="button-secondary">تسجيل الدخول</Link>
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
