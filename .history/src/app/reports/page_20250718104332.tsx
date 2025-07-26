import LeasingMonthlySummaryCard from './LeasingMonthlySummaryCard';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-black">التقارير والإحصائيات</h1>
        <p className="text-lg text-black opacity-90">
          تحليل شامل لأداء المبيعات والتمويل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* بطاقة ملخص الإيجار الشهري */}
        <LeasingMonthlySummaryCard />
        {/* تقرير المبيعات */}
        <div className="glass-card p-6 bg-gradient-to-br from-green-100 to-green-50 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-black">تقرير المبيعات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-transparent">
              <span className="text-black">إجمالي المبيعات</span>
              <span className="text-xl font-bold text-black">2,405,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-transparent">
              <span className="text-black">عدد السيارات المباعة</span>
              <span className="text-xl font-bold text-black">90 سيارة</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-transparent">
              <span className="text-black">متوسط سعر السيارة</span>
              <span className="text-xl font-bold text-black">26,722 ريال</span>
            </div>
          </div>
        </div>

        {/* تقرير التمويل */}
        <div className="glass-card p-6 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-black">تقرير التمويل</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-100 to-transparent">
              <span className="text-black">إجمالي التمويل</span>
              <span className="text-xl font-bold text-black">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-100 to-transparent">
              <span className="text-black">عدد العقود النشطة</span>
              <span className="text-xl font-bold text-black">156 عقد</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-100 to-transparent">
              <span className="text-black">متوسط مدة التمويل</span>
              <span className="text-xl font-bold text-black">24 شهر</span>
            </div>
          </div>
        </div>

        {/* تقرير المصروفات */}
        <div className="glass-card p-6 bg-gradient-to-br from-red-100 to-red-50 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-black">تقرير المصروفات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-100 to-transparent">
              <span className="text-black">الرواتب</span>
              <span className="text-xl font-bold text-black">60,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-100 to-transparent">
              <span className="text-black">الإيجار</span>
              <span className="text-xl font-bold text-black">9,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-100 to-transparent">
              <span className="text-black">تكاليف التشغيل</span>
              <span className="text-xl font-bold text-black">102,750 ريال</span>
            </div>
          </div>
        </div>

        {/* صافي الربح */}
        <div className="glass-card p-6 bg-gradient-to-br from-purple-100 to-purple-50 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-black">صافي الربح</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-transparent">
              <span className="text-black">إجمالي الإيرادات</span>
              <span className="text-xl font-bold text-black">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-100 to-transparent">
              <span className="text-black">إجمالي المصروفات</span>
              <span className="text-xl font-bold text-black">171,750 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-100 to-transparent font-bold">
              <span className="text-black">صافي الربح</span>
              <span className="text-2xl text-black">1,710,500 ريال</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 