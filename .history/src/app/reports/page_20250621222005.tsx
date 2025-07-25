export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-white shadow-md">
        <h1 className="text-3xl font-bold mb-4">التقارير والإحصائيات</h1>
        <p className="text-lg opacity-90">
          تحليل شامل لأداء المبيعات والتمويل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تقرير المبيعات */}
        <div className="glass-card p-6 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-green-800">تقرير المبيعات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
              <span className="text-green-700">إجمالي المبيعات</span>
              <span className="text-xl font-bold text-green-800">2,405,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
              <span className="text-green-700">عدد السيارات المباعة</span>
              <span className="text-xl font-bold text-green-800">90 سيارة</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
              <span className="text-green-700">متوسط سعر السيارة</span>
              <span className="text-xl font-bold text-green-800">26,722 ريال</span>
            </div>
          </div>
        </div>

        {/* تقرير التمويل */}
        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">تقرير التمويل</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent">
              <span className="text-blue-700">إجمالي التمويل</span>
              <span className="text-xl font-bold text-blue-800">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent">
              <span className="text-blue-700">عدد العقود النشطة</span>
              <span className="text-xl font-bold text-blue-800">156 عقد</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent">
              <span className="text-blue-700">متوسط مدة التمويل</span>
              <span className="text-xl font-bold text-blue-800">24 شهر</span>
            </div>
          </div>
        </div>

        {/* تقرير المصروفات */}
        <div className="glass-card p-6 bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-red-800">تقرير المصروفات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent">
              <span className="text-red-700">الرواتب</span>
              <span className="text-xl font-bold text-red-800">60,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent">
              <span className="text-red-700">الإيجار</span>
              <span className="text-xl font-bold text-red-800">9,000 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent">
              <span className="text-red-700">تكاليف التشغيل</span>
              <span className="text-xl font-bold text-red-800">102,750 ريال</span>
            </div>
          </div>
        </div>

        {/* صافي الربح */}
        <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-white shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">صافي الربح</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
              <span className="text-green-700">إجمالي الإيرادات</span>
              <span className="text-xl font-bold text-green-700">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent">
              <span className="text-red-700">إجمالي المصروفات</span>
              <span className="text-xl font-bold text-red-700">171,750 ريال</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-transparent font-bold">
              <span className="text-purple-700">صافي الربح</span>
              <span className="text-2xl text-purple-700">1,710,500 ريال</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 