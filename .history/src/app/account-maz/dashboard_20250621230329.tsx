'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم المالية</h1>
        <Link href="/" className="button-secondary">
          العودة للرئيسية
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/account-maz/financial-entry" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">القيود المالية</h3>
          <p className="text-gray-400">إدارة وإدخال القيود المالية اليومية</p>
        </Link>

        <Link href="/account-maz/annual-summary" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">الملخص السنوي</h3>
          <p className="text-gray-400">عرض وتحليل البيانات السنوية</p>
        </Link>

        <Link href="/account-maz/monthly-view" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">العرض الشهري</h3>
          <p className="text-gray-400">تحليل وعرض البيانات الشهرية</p>
        </Link>

        <Link href="/account-maz/beginning-balance" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">الرصيد الافتتاحي</h3>
          <p className="text-gray-400">إدارة الأرصدة الافتتاحية</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">إحصائيات سريعة</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold">٠ ريال</div>
              <div className="text-sm text-gray-400">إجمالي الإيرادات</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold">٠ ريال</div>
              <div className="text-sm text-gray-400">إجمالي المصروفات</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
          <div className="space-y-2">
            <Link href="/account-maz/financial-reports" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              التقارير المالية
            </Link>
            <Link href="/account-maz/annual-budget" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              الميزانية السنوية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 