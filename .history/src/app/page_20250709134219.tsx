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
        <h1 className="text-4xl font-bold mb-4 text-black"> اهلا بكم في معرض شركة محمد احمد الزهراني واخوانه للسيارات</h1>
        <p className="text-xl text-black opacity-90 mb-6">
           نقل ملكية بيع سيارات مستعمله وتأجير منتهي بالتمليك 
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/cars" className="button-primary text-lg px-8 py-3">
            قسم السيارات نظام البيع النقدي 
          </Link>
          <Link href="/car-finance" className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md">
            نظام التأجير المنتهي بالتمليك
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

      {/* Grid Layout: سلايدر صور السيارات */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-3xl">
          <CarImageSlider />
        </div>
      </div>

      {/* زر حاسبة التمويل */}
      <div className="mt-8 flex justify-center">
        <a
          href="/finance"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md transition-colors"
        >
          📈 احسب التمويل الآن
        </a>
      </div>

      {/* باقي البطاقات (features) في صف آخر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* بطاقة لوحة التحكم */}
        <div className="glass-card p-6 bg-gradient-to-br from-purple-100 to-purple-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">🛠️ لوحة التحكم</h3>
          <p className="text-black opacity-90 mb-4">
            تابع عمليات التمويل وإدارة المبيعات بشكل فعال
          </p>
          <Link href="/dashboard" className="text-purple-700 hover:text-purple-800 font-bold">
            عرض اللوحة →
          </Link>
        </div>
        {/* بطاقة لوحة التاجر */}
        <div className="glass-card p-6 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">💼 لوحة التاجر</h3>
          <p className="text-black opacity-90 mb-4">
            إدارة العمليات التجارية وتتبع المبيعات والأرباح
          </p>
          <Link href="/dealer/dashboard" className="text-amber-700 hover:text-amber-800 font-bold">
            فتح اللوحة →
          </Link>
        </div>
        {/* بطاقة نظام البيع بالتقسيط */}
        <div className="glass-card p-6 bg-gradient-to-br from-pink-100 to-pink-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">💸 نظام البيع بالتقسيط المنتهي بالتمليك</h3>
          <p className="text-black opacity-90 mb-4">
            جدول تمويل تفصيلي يوضح جميع الخيارات والأرباح المتوقعة
          </p>
          <Link href="/car-finance" className="text-pink-700 hover:text-pink-800 font-bold">
            اكتشف التفاصيل →
          </Link>
        </div>
        {/* بطاقة إضافية (اختياري) */}
        <div className="glass-card p-6 bg-gradient-to-br from-green-100 to-green-50 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-black">ميزة إضافية</h3>
          <p className="text-black opacity-90 mb-4">
            يمكنك تخصيص هذه البطاقة لأي ميزة أو رابط آخر.
          </p>
        </div>
      </div>

      {/* نموذج إدخال معلومات السيارة */}
      <div className="mt-12">
        <CarEntryForm className="text-black w-full" />
      </div>

      {/* السيارات المتاحة للشراء */}
      <div className="mt-12">
        <AvailableCars />
      </div>
    </div>
  );
}
