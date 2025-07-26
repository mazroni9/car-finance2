'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  availableCars: number;
  totalFinancing: number;
  activeContracts: number;
}

interface ProfitRate {
  baseRate: number;
  reducedRate: number;
  isActive: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    availableCars: 25,
    totalFinancing: 2400000,
    activeContracts: 156
  });

  const [profitRates, setProfitRates] = useState<ProfitRate[]>([
    { baseRate: 30, reducedRate: 25, isActive: true },
    { baseRate: 50, reducedRate: 45, isActive: false },
    { baseRate: 65, reducedRate: 60, isActive: false }
  ]);

  const handleRateChange = (index: number, field: 'baseRate' | 'reducedRate', value: number) => {
    const newRates = [...profitRates];
    newRates[index][field] = value;
    setProfitRates(newRates);
  };

  const handleRateActivation = (index: number) => {
    const newRates = profitRates.map((rate, i) => ({
      ...rate,
      isActive: i === index
    }));
    setProfitRates(newRates);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-lg opacity-90">
              نظرة عامة على حالة التمويل والسيارات
            </p>
          </div>
          <Link 
            href="/finance" 
            className="button-primary"
          >
            حساب تمويل جديد
          </Link>
        </div>
      </div>

      {/* Profit Rate Controls */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-right">التحكم في نسب المرابحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profitRates.map((rate, index) => (
            <div 
              key={index}
              className={`glass-card p-4 border-2 ${rate.isActive ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">النسبة الأساسية</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={rate.baseRate}
                      onChange={(e) => handleRateChange(index, 'baseRate', Number(e.target.value))}
                      className="input-field w-20 text-left"
                      min="0"
                      max="100"
                      aria-label="النسبة الأساسية"
                    />
                    <span className="mr-2">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">النسبة المخفضة</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={rate.reducedRate}
                      onChange={(e) => handleRateChange(index, 'reducedRate', Number(e.target.value))}
                      className="input-field w-20 text-left"
                      min="0"
                      max="100"
                      aria-label="النسبة المخفضة"
                    />
                    <span className="mr-2">%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRateActivation(index)}
                  className={`w-full py-2 px-4 rounded ${rate.isActive ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {rate.isActive ? 'نشط' : 'تفعيل'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">السيارات المتاحة</h3>
          <div className="text-3xl font-bold text-primary">{stats.availableCars}</div>
          <p className="text-sm opacity-80">سيارة</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">إجمالي التمويل</h3>
          <div className="text-3xl font-bold text-secondary">{(stats.totalFinancing / 1000000).toFixed(1)}M</div>
          <p className="text-sm opacity-80">ريال</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">العقود النشطة</h3>
          <div className="text-3xl font-bold text-accent">{stats.activeContracts}</div>
          <p className="text-sm opacity-80">عقد</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">آخر العمليات</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>تمويل سيارة تويوتا كامري 2024</span>
              <span className="text-sm opacity-80">قبل 3 ساعات</span>
            </div>
            <div className="flex justify-between items-center">
              <span>تمويل سيارة هونداي سوناتا 2024</span>
              <span className="text-sm opacity-80">قبل 5 ساعات</span>
            </div>
            <div className="flex justify-between items-center">
              <span>تمويل سيارة كيا K5 2024</span>
              <span className="text-sm opacity-80">قبل 8 ساعات</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">إحصائيات سريعة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>متوسط مدة التمويل</span>
              <span className="font-bold">24 شهر</span>
            </div>
            <div className="flex justify-between items-center">
              <span>متوسط مبلغ التمويل</span>
              <span className="font-bold">85,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span>نسبة الدفعة الأولى الأكثر اختياراً</span>
              <span className="font-bold">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 