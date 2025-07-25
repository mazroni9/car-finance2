'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/75 shadow-sm">
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
                  className={`nav-link ${pathname === '/' ? 'bg-blue-50' : ''}`}
                >
                  الرئيسية
                </Link>
                <Link 
                  href="/cars" 
                  className={`nav-link ${pathname === '/cars' ? 'bg-blue-50' : ''}`}
                >
                  معرض السيارات
                </Link>
                <Link 
                  href="/wallet" 
                  className={`nav-link ${pathname === '/wallet' ? 'bg-blue-50' : ''}`}
                >
                  المحفظة
                </Link>
                <Link 
                  href="/transactions" 
                  className={`nav-link ${pathname === '/transactions' ? 'bg-blue-50' : ''}`}
                >
                  المعاملات
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="button-primary">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 