export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-4">التقارير والإحصائيات</h1>
        <p className="text-lg opacity-90">
          تحليل شامل لأداء المبيعات والتمويل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تقرير المبيعات */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">تقرير المبيعات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>إجمالي المبيعات</span>
              <span className="text-xl font-bold">2,405,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>عدد السيارات المباعة</span>
              <span className="text-xl font-bold">90 سيارة</span>
            </div>
            <div className="flex justify-between items-center">
              <span>متوسط سعر السيارة</span>
              <span className="text-xl font-bold">26,722 ريال</span>
            </div>
          </div>
        </div>

        {/* تقرير التمويل */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">تقرير التمويل</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>إجمالي التمويل</span>
              <span className="text-xl font-bold">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>عدد العقود النشطة</span>
              <span className="text-xl font-bold">156 عقد</span>
            </div>
            <div className="flex justify-between items-center">
              <span>متوسط مدة التمويل</span>
              <span className="text-xl font-bold">24 شهر</span>
            </div>
          </div>
        </div>

        {/* تقرير المصروفات */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">تقرير المصروفات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>الرواتب</span>
              <span className="text-xl font-bold">60,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الإيجار</span>
              <span className="text-xl font-bold">9,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>تكاليف التشغيل</span>
              <span className="text-xl font-bold">102,750 ريال</span>
            </div>
          </div>
        </div>

        {/* صافي الربح */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">صافي الربح</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>إجمالي الإيرادات</span>
              <span className="text-xl font-bold text-green-500">1,882,250 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>إجمالي المصروفات</span>
              <span className="text-xl font-bold text-red-500">171,750 ريال</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>صافي الربح</span>
              <span className="text-2xl text-primary">1,710,500 ريال</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 