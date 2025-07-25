'use client';

import Link from 'next/link';
import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">نظام تمويل السيارات</h1>
        <p className="text-xl text-black opacity-90 mb-6">
          حلول تمويل مرنة وميسرة لشراء سيارة أحلامك
        </p>
        {/* ... باقي الروابط ... */}
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
      {/* ... البطاقات ... */}

      {/* Statistics Section */}
      {/* ... الإحصائيات ... */}
    </div>
  );
}
