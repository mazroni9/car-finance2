'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export default function HomePage(): ReactNode {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">نظام تمويل السيارات</h1>
        <p className="text-xl text-black opacity-90 mb-6">
          حلول تمويل مرنة وميسرة لشراء سيارة أحلامك
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/cars"
            className="button-primary text-lg px-8 py-3"
          >لق
            تصفح السيارات
          </Link>
          <Link 
            href="/finance"
            className="button-secondary text-lg px-8 py-3"
          >
            احسب التمويل
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-green-100 to-green-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">معرض السيارات</h3>
          <p className="text-black opacity-90 mb-4">
            تصفح مجموعة متنوعة من السيارات الحديثة المتاحة للتمويل
          </p>
          <Link href="/cars" className="text-green-700 hover:text-green-800 font-bold">
            استعرض المعرض →
          </Link>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">حاسبة التمويل</h3>
          <p className="text-black opacity-90 mb-4">
            احسب قسطك الشهري وتفاصيل التمويل بكل سهولة
          </p>
          <Link href="/finance" className="text-blue-700 hover:text-blue-800 font-bold">
            احسب الآن →
          </Link>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-purple-100 to-purple-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">لوحة التحكم</h3>
          <p className="text-black opacity-90 mb-4">
            تابع عمليات التمويل وإدارة المبيعات بشكل فعال
          </p>
          <Link href="/dashboard" className="text-purple-700 hover:text-purple-800 font-bold">
            عرض اللوحة →
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-gray-100 to-gray-50 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">إحصائيات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-black">+1000</div>
            <p className="text-black opacity-90">عميل راضٍ</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-black">+500</div>
            <p className="text-black opacity-90">سيارة تم تمويلها</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-black">24/7</div>
            <p className="text-black opacity-90">دعم متواصل</p>
          </div>
        </div>
      </div>
    </div>
  );
} 