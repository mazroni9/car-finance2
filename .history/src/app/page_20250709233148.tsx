import Link from 'next/link';
import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';
import AvailableCars from '@/components/AvailableCars';
import FinanceCalculator from '@/app/finance/page';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">
          أهلاً بكم في معرض شركة محمد أحمد الزهراني وإخوانه للسيارات
        </h1>
        <p className="text-xl text-black opacity-90 mb-6">
          نقل ملكية، بيع سيارات مستعملة، ونظام التأجير
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/cars" className="button-primary text-lg px-8 py-3">
            تصفح سيارات المعرض
          </Link>
          <Link href="/trader-finance" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            تمويل التاجر
          </Link>
          <Link href="/car-finance" className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            نظام التأجير
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
          href="/finance"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          📈 احسب التمويل الآن
        </a>
        <a
          href="/admin/car-finance-entry"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          📝 ادارة نموذج الاقساط
        </a>
        <a
          href="/dashboard/settlements"
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors"
        >
          <span>مراقبة التسويات</span>
          <span className="text-lg">💰</span>
        </a>
        <a
          href="/cars/new"
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          🚗 إضافة سيارة
        </a>
      </div>

      {/* السيارات المتاحة للشراء */}
      <div className="mt-12">
        <AvailableCars />
      </div>
    </div>
  );
}
