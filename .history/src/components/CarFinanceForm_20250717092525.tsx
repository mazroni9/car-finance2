'use client';

import React, { useState, useEffect } from 'react';
import { BackButton } from '@/components/ui/back-button';

interface CarFinanceFormProps {}

export default function CarFinanceForm({}: CarFinanceFormProps): JSX.Element {
  const [priceCategory, setPriceCategory] = useState<number>(20000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [quantity, setQuantity] = useState<number>(1);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0.10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState<number>(0.20);
  const [profitTargetPercent, setProfitTargetPercent] = useState<number>(30);
  const [status, setStatus] = useState<string>('');
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // حساب القيم المحسوبة
  const downPaymentValue = priceCategory * downPaymentPercent;
  const lastPaymentValue = priceCategory * lastPaymentPercent;
  const financedAmount = priceCategory - downPaymentValue - lastPaymentValue;
  const monthlyInstallment = financedAmount / durationMonths;
  const totalProfit = priceCategory * (profitTargetPercent / 100);
  const profitPerCar = totalProfit / quantity;

  const saveData = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setStatus('جارٍ الحفظ...');

    try {
      const res = await fetch('/api/installment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_category: priceCategory,
          duration_months: durationMonths,
          quantity,
          down_payment_percent: downPaymentPercent,
          last_payment_percent: lastPaymentPercent,
          profit_target_percent: profitTargetPercent,
          down_payment_value: downPaymentValue,
          last_payment_value: lastPaymentValue,
          monthly_installment: monthlyInstallment,
          possible_purchase_amount: priceCategory,
          profit_per_car: profitPerCar,
          total_sale_price: priceCategory * (1 + profitTargetPercent / 100)
        })
      });

      if (res.ok) {
        setStatus('✅ تم الحفظ بنجاح');
        setTimeout(() => setStatus(''), 3000);
      } else {
        const err = await res.json();
        setStatus(`❌ خطأ: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(saveData, 1000);
      return () => clearTimeout(timer);
    }
  }, [priceCategory, durationMonths, quantity, downPaymentPercent, lastPaymentPercent, profitTargetPercent, autoSave]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 relative">
      <div className="absolute top-6 right-8 z-20">
        <BackButton />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">📝 إضافة بيانات تمويل سيارة</h1>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-sm font-medium text-white">حفظ تلقائي</span>
                  <div className={`relative w-14 h-7 transition duration-200 ease-linear rounded-full ${autoSave ? 'bg-green-400' : 'bg-gray-400'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      aria-label="تفعيل الحفظ التلقائي"
                    />
                    <div className={`absolute left-1 top-1 w-5 h-5 transition duration-200 ease-linear transform bg-white rounded-full ${autoSave ? 'translate-x-7' : 'translate-x-0'}`}></div>
                  </div>
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  {showPreview ? 'إخفاء المعاينة' : 'عرض المعاينة'}
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="priceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  الفئة السعرية (ريال)
                </label>
                <select
                  id="priceCategory"
                  value={priceCategory}
                  onChange={(e) => setPriceCategory(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="اختر الفئة السعرية"
                  dir="rtl"
                >
                  <option value={20000}>20,000 ريال</option>
                  <option value={25000}>25,000 ريال</option>
                  <option value={30000}>30,000 ريال</option>
                  <option value={40000}>40,000 ريال</option>
                  <option value={50000}>50,000 ريال</option>
                  <option value={60000}>60,000 ريال</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  مدة التمويل (شهر)
                </label>
                <select
                  id="durationMonths"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="اختر مدة التمويل"
                  dir="rtl"
                >
                  <option value={12}>12 شهر</option>
                  <option value={18}>18 شهر</option>
                  <option value={24}>24 شهر</option>
                  <option value={36}>36 شهر</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  عدد السيارات
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="أدخل عدد السيارات"
                  placeholder="أدخل عدد السيارات"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  نسبة الدفعة الأولى
                </label>
                <select
                  id="downPayment"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="اختر نسبة الدفعة الأولى"
                  dir="rtl"
                >
                  <option value={0.10}>10%</option>
                  <option value={0.15}>15%</option>
                  <option value={0.20}>20%</option>
                  <option value={0.25}>25%</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  نسبة الدفعة الأخيرة
                </label>
                <select
                  id="lastPayment"
                  value={lastPaymentPercent}
                  onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="اختر نسبة الدفعة الأخيرة"
                  dir="rtl"
                >
                  <option value={0.10}>10%</option>
                  <option value={0.15}>15%</option>
                  <option value={0.20}>20%</option>
                  <option value={0.25}>25%</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="profitTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  نسبة الربح المستهدفة
                </label>
                <select
                  id="profitTarget"
                  value={profitTargetPercent}
                  onChange={(e) => setProfitTargetPercent(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="اختر نسبة الربح"
                  dir="rtl"
                >
                  <option value={20}>20%</option>
                  <option value={25}>25%</option>
                  <option value={30}>30%</option>
                  <option value={35}>35%</option>
                  <option value={40}>40%</option>
                  <option value={50}>50%</option>
                </select>
              </div>
            </div>

            {/* معاينة الحسابات */}
            {showPreview && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">معاينة الحسابات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الدفعة الأولى</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(downPaymentValue)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الدفعة الأخيرة</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(lastPaymentValue)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">المبلغ الممول</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(financedAmount)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">القسط الشهري</p>
                    <p className="text-lg font-bold text-orange-600">{formatCurrency(monthlyInstallment)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الربح الإجمالي</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(totalProfit)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الربح لكل سيارة</p>
                    <p className="text-lg font-bold text-indigo-600">{formatCurrency(profitPerCar)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الأقساط</p>
                    <p className="text-lg font-bold text-teal-600">{formatCurrency(monthlyInstallment * durationMonths)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">سعر البيع الإجمالي</p>
                    <p className="text-lg font-bold text-pink-600">{formatCurrency(priceCategory + totalProfit)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={saveData}
                disabled={isSaving}
                className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                  isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
                aria-label="حفظ البيانات"
              >
                {isSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ في قاعدة البيانات'}
              </button>

              {status && (
                <div 
                  className={`mt-4 p-4 rounded-lg text-center ${
                    status.includes('✅') ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    status.includes('❌') ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 