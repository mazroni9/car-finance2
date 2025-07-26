'use client';

import React, { useState } from 'react';

interface FinanceData {
  id: string;
  profit_percent: number;
  duration_months: number;
  price_category: number;
  car_count: number;
  first_payment_percent: number;
  first_payment: number;
  last_payment: number;
  profit_after: number;
  installment_sale_price: number;
  monthly_installment: number;
  monthly_income: number;
  purchase_capacity: number;
  annual_income: number;
  tracking_cost: number;
  guarantor_cost: number;
  inspection_cost: number;
  salary_distribution: number;
  rent_distribution: number;
}

interface ManualDataEntryProps {
  onAddData: (data: FinanceData) => void;
}

export default function ManualDataEntry({ onAddData }: ManualDataEntryProps) {
  const [formData, setFormData] = useState<Partial<FinanceData>>({
    profit_percent: 30,
    duration_months: 12,
    price_category: 20000,
    car_count: 1,
    first_payment_percent: 10,
    first_payment: 2000,
    last_payment: 3000,
    profit_after: 5400,
    installment_sale_price: 25400,
    monthly_installment: 0,
    monthly_income: 0,
    purchase_capacity: 0,
    annual_income: 0,
    tracking_cost: 0,
    guarantor_cost: 0,
    inspection_cost: 0,
    salary_distribution: 0,
    rent_distribution: 0,
  });

  const handleProfitChange = (profitPercent: number) => {
    let durationMonths: number;
    
    // ربط نسبة الربح مع مدة التمويل
    switch (profitPercent) {
      case 30:
        durationMonths = 12;
        break;
      case 40:
        durationMonths = 18;
        break;
      case 50:
        durationMonths = 24;
        break;
      case 55:
        durationMonths = 30;
        break;
      case 60:
        durationMonths = 36;
        break;
      default:
        durationMonths = 12;
    }
    
    setFormData(prev => ({
      ...prev,
      profit_percent: profitPercent,
      duration_months: durationMonths
    }));
  };

  const handleDurationChange = (durationMonths: number) => {
    let profitPercent: number;
    
    // ربط مدة التمويل مع نسبة الربح
    switch (durationMonths) {
      case 12:
        profitPercent = 30;
        break;
      case 18:
        profitPercent = 40;
        break;
      case 24:
        profitPercent = 50;
        break;
      case 30:
        profitPercent = 55;
        break;
      case 36:
        profitPercent = 60;
        break;
      default:
        profitPercent = 30;
    }
    
    setFormData(prev => ({
      ...prev,
      profit_percent: profitPercent,
      duration_months: durationMonths
    }));
  };

  const handleInputChange = (field: keyof FinanceData, value: number) => {
    const newFormData = {
      ...formData,
      [field]: value
    };

    // تطبيق جميع المعادلات عند تغيير أي قيمة
    if (field === 'price_category' || field === 'profit_percent' || field === 'first_payment' || field === 'last_payment' || field === 'duration_months' || field === 'car_count') {
      // حساب الربح = الفئة السعرية × نسبة الربح
      const profit = newFormData.price_category! * (newFormData.profit_percent! / 100);
      
      // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
      const totalAmount = newFormData.price_category! + profit;
      
      // حساب القسط الشهري = (سعر البيع بالتقسيط - الدفعة الأولى - الدفعة الأخيرة) ÷ مدة التمويل
      const remainingAmount = totalAmount - newFormData.first_payment! - newFormData.last_payment!;
      const monthlyInstallment = remainingAmount / newFormData.duration_months!;
      
      // حساب الدخل الشهري = القسط الشهري × عدد السيارات
      const monthlyIncome = monthlyInstallment * newFormData.car_count!;
      
      // حساب كم نقدر نشتري = الفئة السعرية × عدد السيارات
      const purchaseCapacity = newFormData.price_category! * newFormData.car_count!;
      
      // حساب الدخل السنوي = الدخل الشهري × 12
      const annualIncome = monthlyIncome * 12;
      
      // تحديث جميع القيم المحسوبة
      newFormData.profit_after = Math.round(profit);
      newFormData.installment_sale_price = Math.round(totalAmount);
      newFormData.monthly_installment = Math.round(monthlyInstallment);
      newFormData.monthly_income = Math.round(monthlyIncome);
      newFormData.purchase_capacity = purchaseCapacity;
      newFormData.annual_income = Math.round(annualIncome);
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // حساب الربح = الفئة السعرية × نسبة الربح
    const profit = formData.price_category! * (formData.profit_percent! / 100);
    
    // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
    const totalAmount = formData.price_category! + profit;
    
    // حساب القسط الشهري = (سعر البيع بالتقسيط - الدفعة الأولى - الدفعة الأخيرة) ÷ مدة التمويل
    const remainingAmount = totalAmount - formData.first_payment! - formData.last_payment!;
    const monthlyInstallment = remainingAmount / formData.duration_months!;
    const monthlyIncome = monthlyInstallment * formData.car_count!;
    
    // حساب كم نقدر نشتري = الفئة السعرية × عدد السيارات
    const purchaseCapacity = formData.price_category! * formData.car_count!;
    
    // حساب الدخل السنوي = الدخل الشهري × 12
    const annualIncome = monthlyIncome * 12;
    
    const newData: FinanceData = {
      id: `manual_${Date.now()}`,
      profit_percent: formData.profit_percent || 30,
      duration_months: formData.duration_months || 12,
      price_category: formData.price_category || 20000,
      car_count: formData.car_count || 1,
      first_payment_percent: formData.first_payment_percent || 10,
      first_payment: formData.first_payment || 2000,
      last_payment: formData.last_payment || 3000,
      profit_after: Math.round(profit),
      installment_sale_price: Math.round(totalAmount),
      monthly_installment: Math.round(monthlyInstallment),
      monthly_income: Math.round(monthlyIncome),
      purchase_capacity: purchaseCapacity,
      annual_income: Math.round(annualIncome),
      tracking_cost: formData.tracking_cost || 0,
      guarantor_cost: formData.guarantor_cost || 0,
      inspection_cost: formData.inspection_cost || 0,
      salary_distribution: formData.salary_distribution || 0,
      rent_distribution: formData.rent_distribution || 0,
    };

    onAddData(newData);
    
    // إعادة تعيين النموذج
    setFormData({
      profit_percent: 30,
      duration_months: 12,
      price_category: 20000,
      car_count: 1,
      first_payment_percent: 10,
      first_payment: 2000,
      last_payment: 3000,
      profit_after: 0,
      installment_sale_price: 0,
      monthly_installment: 0,
      monthly_income: 0,
      purchase_capacity: 0,
      annual_income: 0,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    });

    alert('تم إضافة البيانات بنجاح!');
  };

  // تنسيق الأرقام بالإنجليزية
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">إدخال بيانات جديدة</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نسبة الربح (%)
            </label>
            <select
              value={formData.profit_percent}
              onChange={(e) => handleProfitChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="نسبة الربح"
            >
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
              <option value={55}>55%</option>
              <option value={60}>60%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مدة التمويل (شهر)</label>
            <input
              type="number"
              value={formData.duration_months}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="مدة التمويل"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفئة السعرية</label>
            <input
              type="number"
              value={formData.price_category}
              onChange={(e) => handleInputChange('price_category', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="الفئة السعرية"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عدد السيارات</label>
            <input
              type="number"
              value={formData.car_count}
              onChange={(e) => handleInputChange('car_count', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="عدد السيارات"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الدفعة الأولى (%)</label>
            <input
              type="number"
              value={formData.first_payment_percent}
              onChange={(e) => handleInputChange('first_payment_percent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="نسبة الدفعة الأولى"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدفعة الأولى</label>
            <input
              type="number"
              value={formData.first_payment}
              onChange={(e) => handleInputChange('first_payment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="الدفعة الأولى"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">دفعة أخيرة</label>
            <input
              type="number"
              value={formData.last_payment}
              onChange={(e) => handleInputChange('last_payment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="دفعة أخيرة"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الربح بعد (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.profit_after}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold"
              title="الربح بعد"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع بالتقسيط (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.installment_sale_price}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-purple-100 text-purple-700 font-semibold"
              title="سعر البيع بالتقسيط"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">القسط الشهري (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.monthly_installment}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-semibold"
              title="القسط الشهري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدخل الشهري (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.monthly_income}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold"
              title="الدخل الشهري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كم نقدر نشتري (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.purchase_capacity}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-purple-100 text-purple-700 font-semibold"
              title="كم نقدر نشتري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدخل السنوي (محسوب تلقائيًا)</label>
            <input
              type="number"
              value={formData.annual_income}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-blue-100 text-blue-700 font-semibold"
              title="الدخل السنوي"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تكلفة التتبع</label>
            <input
              type="number"
              value={formData.tracking_cost}
              onChange={(e) => handleInputChange('tracking_cost', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="تكلفة التتبع"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تكلفة عقد ضامن</label>
            <input
              type="number"
              value={formData.guarantor_cost}
              onChange={(e) => handleInputChange('guarantor_cost', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="تكلفة عقد ضامن"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تكلفة الفحص الفني</label>
            <input
              type="number"
              value={formData.inspection_cost}
              onChange={(e) => handleInputChange('inspection_cost', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="تكلفة الفحص الفني"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توزيع الراتب</label>
            <input
              type="number"
              value={formData.salary_distribution}
              onChange={(e) => handleInputChange('salary_distribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="توزيع الراتب"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توزيع الإيجار</label>
            <input
              type="number"
              value={formData.rent_distribution}
              onChange={(e) => handleInputChange('rent_distribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="توزيع الإيجار"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            ➕ إضافة البيانات
          </button>
        </div>
      </form>
    </div>
  );
} 