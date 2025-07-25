"use client";
import Link from 'next/link';
import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';
import AvailableCars from '@/components/AvailableCars';
import FinanceCalculator from '@/app/finance/page';
import Marquee from "react-fast-marquee";

export default function HomePage() {
  return (
    <div className="space-y-8 mt-10">
      {/* الشريط المتحرك أعلى الصفحة */}
      <Marquee
        direction="right"
        speed={40}
        gradient={false}
        className="bg-blue-900 text-white font-bold text-lg py-2"
      >
        لماذا تستثمر معنا؟ ✔️ تمويل شرعي
        <span style={{ display: "inline-block", width: 80 }}></span>
        طرق تمويل متنوعة
        <span style={{ display: "inline-block", width: 80 }}></span>
        أرباح دورية تصلك بانتظام
        <span style={{ display: "inline-block", width: 80 }}></span>
        التخارج متاح بعد سنتين أو خمس سنوات أو حسب رغبتك
        <span style={{ display: "inline-block", width: 80 }}></span>
        كل استفساراتك يجيبك عليها فريق الكنترول روم أو صفحة "استثمر معنا"
        <span style={{ display: "inline-block", width: 80 }}></span>
        الاشتراك في أنظمتنا شرعي 100%
        <span style={{ display: "inline-block", width: 80 }}></span>
        استثمر معنا اليوم 🚀 لا يردك إلا أرباحك!
        <span style={{ display: "inline-block", width: 80 }}></span>
        اقدم واستثمر والله لو قالت السعوديه اقدم اني لاقدم
        <span style={{ display: "inline-block", width: 120 }}></span>
        لماذا تستثمر معنا؟ ✔️ تمويل شرعي
        <span style={{ display: "inline-block", width: 80 }}></span>
        طرق تمويل متنوعة
        <span style={{ display: "inline-block", width: 80 }}></span>
        أرباح دورية تصلك بانتظام
        <span style={{ display: "inline-block", width: 80 }}></span>
        التخارج متاح بعد سنتين أو خمس سنوات أو حسب رغبتك
        <span style={{ display: "inline-block", width: 80 }}></span>
        كل استفساراتك يجيبك عليها فريق الكنترول روم أو صفحة "استثمر معنا"
        <span style={{ display: "inline-block", width: 80 }}></span>
        الاشتراك في أنظمتنا شرعي 100%
        <span style={{ display: "inline-block", width: 80 }}></span>
        استثمر معنا اليوم 🚀 لا يردك إلا أرباحك!
        <span style={{ display: "inline-block", width: 80 }}></span>
        اقدم واستثمر والله لو قالت الهيلا
         اقدم اني لاقدم
      </Marquee>
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
          <Link href="/investor-pitch.html" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            🎯 عرض المستثمرين
          </Link>
        </div>
      </div>

      {/* Grid Layout: سلايدر صور السيارات */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-3xl">
          <CarImageSlider />
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
        <a
          href="/admin/car-finance-entry"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          📝 ادارة نموذج الاقساط
        </a>
        {/* تم حذف زر مراقبة التسويات */}
      </div>

      {/* السيارات المتاحة للشراء */}
      <div className="mt-12">
        <AvailableCars />
      </div>
    </div>
  );
}
