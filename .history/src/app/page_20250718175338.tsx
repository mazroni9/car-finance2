"use client";
import Link from 'next/link';
import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';
import AvailableCars from '@/components/AvailableCars';
import FinanceCalculator from '@/app/finance/page';

export default function HomePage() {
  return (
    <div className="space-y-8 mt-10">
      {/* الشريط المتحرك أعلى الصفحة */}
      <div className="w-full overflow-hidden bg-blue-900 text-white font-bold text-lg py-2">
        <div 
          className="whitespace-nowrap animate-marquee"
          style={{
            display: 'inline-block'
          }}
        >
          انتظرونا قريباً
          <span style={{ display: "inline-block", width: 120 }}></span>
          هذه الواجهة ستكون مخصصة للتجار والمستثمرين، أما منصة المزاد فتذهب إليها عبر الضغط على زر المنصة الأم
        </div>
      </div>
      {/* Hero Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md text-center relative">
        <h1 className="text-4xl font-bold mb-4 text-black">
          أهلاً بكم في معرض شركة محمد أحمد الزهراني وإخوانه للسيارات
        </h1>
        <p className="text-xl text-black opacity-90 mb-6">
          نقل ملكية، بيع سيارات مستعملة، ونظام التأجير
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <a
            href="https://mazbrothers.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md"
          >
            المنصة الأم
          </a>
          <Link href="/cars" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            تصفح سيارات المعرض
          </Link>
          <Link href="/trader-finance" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            تمويل التاجر
          </Link>
          <Link href="/car-finance" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            نظام تأجير السيارات المستعملة
          </Link>
        </div>
      </div>

      {/* Grid Layout: سلايدر صور السيارات */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-3xl">
          <CarImageSlider />
        </div>
      </div>

      {/* قسم إدارة التمويل */}
      <div className="glass-card p-8 bg-gradient-to-br from-purple-100 to-purple-50 shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-800">
          🎯 إدارة قواعد التمويل والأقساط
        </h2>
        <p className="text-lg text-purple-700 mb-6">
          أضف قواعد التمويل الجديدة، عدّل النسب، واحسب الأرباح المتوقعة
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link 
            href="/car-leasing" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <span className="text-2xl">📝</span>
            <div className="text-right">
              <div className="font-bold">نظام التأجير المطور</div>
              <div className="text-sm opacity-90">Advanced Car Leasing System</div>
            </div>
          </Link>
          <Link 
            href="/car-finance" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <span className="text-2xl">📊</span>
            <div className="text-right">
              <div className="font-bold">عرض قواعد التمويل</div>
              <div className="text-sm opacity-90">View Finance Rules</div>
            </div>
          </Link>
        </div>
      </div>

      {/* زر احسب التمويل الآن وزر إدخال تمويل وزر مراقبة التسويات */}
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/cars/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          🚗 إضافة سيارة
        </a>
        <a
          href="/finance"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          📈 احسب التمويل الآن
        </a>
      </div>

      {/* السيارات المتاحة للشراء */}
      <div className="mt-12">
        <AvailableCars />
      </div>
    </div>
  );
}
