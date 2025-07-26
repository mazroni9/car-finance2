'use client';

import Link from 'next/link';
import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';
import { useState } from 'react';
import BuyButton from '@/components/BuyButton';

export default function HomePage() {
  // state
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  return (
    <div className="space-y-8">
      {/* Hero Section مقسوم قسمين مع فاصل */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* القسم الأيسر: التمويل */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-extrabold mb-2 text-blue-900">نظام تمويل السيارات</h1>
            <p className="text-lg text-gray-700 mb-4 max-w-md">حلول تمويل مرنة وميسرة لشراء سيارة أحلامك، مع خيارات متعددة تناسب احتياجك.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <Link href="/finance" className="button-secondary text-lg px-8 py-3 w-full text-center">
                احسب التمويل
              </Link>
              <Link href="/car-finance" className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md w-full text-center">
                نظام التأجير المنتهي بالتمليك
              </Link>
              <Link href="/admin/car-finance-entry" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md w-full text-center">
                إدارة الكميات
              </Link>
              <Link href="/admin/car-finance-entry" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md flex items-center gap-2 w-full justify-center">
                <span>إدخال تمويل</span>
                <span className="text-lg">📝</span>
              </Link>
            </div>
          </div>
          {/* الفاصل */}
          <div className="hidden md:flex h-40 w-px bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 mx-8 rounded-full shadow-lg" />
          {/* القسم الأيمن: معارض السيارات */}
          <div className="flex-1 flex flex-col items-center md:items-end">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">معارض السيارات</h1>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars" className="button-primary text-lg px-8 py-3">
                تصفح السيارات
              </Link>
              <Link href="/dashboard/settlements" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md flex items-center gap-2">
                <span>مراقبة التسويات</span>
                <span className="text-lg">💰</span>
              </Link>
              {/* أزرار مستقبلية هنا */}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: نموذج + معرض السيارات */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[420px]">
        <div className="flex-1 flex items-center justify-center">
          <CarEntryForm />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <CarImageSlider />
        </div>
      </div>

      {/* باقي البطاقات (features) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="glass-card p-6 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">📈 حاسبة التمويل</h3>
          <p className="text-black opacity-90 mb-4">
            احسب قسطك الشهري وتفاصيل التمويل بكل سهولة
          </p>
          <Link href="/finance" className="text-blue-700 hover:text-blue-800 font-bold">
            احسب الآن →
          </Link>
        </div>
        <div className="glass-card p-6 bg-gradient-to-br from-purple-100 to-purple-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">🛠️ لوحة التحكم</h3>
          <p className="text-black opacity-90 mb-4">
            تابع عمليات التمويل وإدارة المبيعات بشكل فعال
          </p>
          <Link href="/dashboard" className="text-purple-700 hover:text-purple-800 font-bold">
            عرض اللوحة →
          </Link>
        </div>
        <div className="glass-card p-6 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">💼 لوحة التاجر</h3>
          <p className="text-black opacity-90 mb-4">
            إدارة العمليات التجارية وتتبع المبيعات والأرباح
          </p>
          <Link href="/dealer/dashboard" className="text-amber-700 hover:text-amber-800 font-bold">
            فتح اللوحة →
          </Link>
        </div>
        <div className="glass-card p-6 bg-gradient-to-br from-pink-100 to-pink-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">💸 نظام البيع بالتقسيط المنتهي بالتمليك</h3>
          <p className="text-black opacity-90 mb-4">
            جدول تمويل تفصيلي يوضح جميع الخيارات والأرباح المتوقعة
          </p>
          <Link href="/car-finance" className="text-pink-700 hover:text-pink-800 font-bold">
            اكتشف التفاصيل →
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
