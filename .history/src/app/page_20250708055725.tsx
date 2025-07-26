'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import CarEntryForm from '@/components/CarEntryForm';

export default function HomePage(): ReactNode {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">نظام تمويل السيارات</h1>
        <p className="text-xl text-black opacity-90 mb-6">
          حلول تمويل مرنة وميسرة لشراء سيارة أحلامك
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/cars" className="button-primary text-lg px-8 py-3">
            تصفح السيارات
          </Link>
          <Link href="/finance" className="button-secondary text-lg px-8 py-3">
            احسب التمويل
          </Link>
          <Link href="/car-finance" className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            نظام البيع بالتقسيط
          </Link>
          <Link href="/admin/car-finance-entry" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            إدارة الكميات
          </Link>
          <Link href="/admin/car-finance-entry" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md flex items-center gap-2">
            <span>إدخال تمويل</span>
            <span className="text-lg">📝</span>
          </Link>
          <Link href="/dashboard/settlements" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md flex items-center gap-2">
            <span>مراقبة التسويات</span>
            <span className="text-lg">💰</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <CarEntryForm />
      {/* Features Grid */}

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
