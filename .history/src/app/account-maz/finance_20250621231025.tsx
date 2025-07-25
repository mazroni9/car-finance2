'use client';

import Link from 'next/link';

export default function Finance() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">نظام الحسابات والتقارير</h1>
        <Link href="/" className="button-secondary">
          العودة للرئيسية
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/account-maz/financial-entry" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">القيود المالية</h3>
          <p className="text-gray-400">إدارة وتسجيل القيود المالية اليومية</p>
        </Link>

        <Link href="/account-maz/financial-reports" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">التقارير المالية</h3>
          <p className="text-gray-400">عرض وتحليل التقارير المالية</p>
        </Link>

        <Link href="/account-maz/beginning-balance" className="glass-card p-6 hover:bg-white/10">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">الأرصدة الافتتاحية</h3>
          <p className="text-gray-400">إدارة الأرصدة الافتتاحية للحسابات</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">التقارير الدورية</h3>
          <div className="space-y-2">
            <Link href="/account-maz/monthly-view" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              التقارير الشهرية
            </Link>
            <Link href="/account-maz/annual-summary" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              التقارير السنوية
            </Link>
            <Link href="/account-maz/annual-budget" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              الميزانية السنوية
            </Link>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">أدوات مساعدة</h3>
          <div className="space-y-2">
            <Link href="/account-maz/real-data" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              البيانات الفعلية
            </Link>
            <Link href="/account-maz/dashboard" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 