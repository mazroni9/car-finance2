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
    monthly_installment: 917,
    monthly_income: 917,
    purchase_capacity: 0,
    annual_income: 11000,
    tracking_cost: 0,
    guarantor_cost: 0,
    inspection_cost: 0,
    salary_distribution: 0,
    rent_distribution: 0,
  });

  const handleInputChange = (field: keyof FinanceData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newData: FinanceData = {
      id: `manual_${Date.now()}`,
      profit_percent: formData.profit_percent || 30,
      duration_months: formData.duration_months || 12,
      price_category: formData.price_category || 20000,
      car_count: formData.car_count || 1,
      first_payment_percent: formData.first_payment_percent || 10,
      first_payment: formData.first_payment || 2000,
      last_payment: formData.last_payment || 3000,
      profit_after: formData.profit_after || 5400,
      installment_sale_price: formData.installment_sale_price || 25400,
      monthly_installment: formData.monthly_installment || 917,
      monthly_income: formData.monthly_income || 917,
      purchase_capacity: formData.purchase_capacity || 0,
      annual_income: formData.annual_income || 11000,
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
      profit_after: 5400,
      installment_sale_price: 25400,
      monthly_installment: 917,
      monthly_income: 917,
      purchase_capacity: 0,
      annual_income: 11000,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    });

    alert('تم إضافة البيانات بنجاح!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">إدخال بيانات جديدة</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الربح (%)</label>
            <input
              type="number"
              value={formData.profit_percent}
              onChange={(e) => handleInputChange('profit_percent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="نسبة الربح"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مدة التمويل (شهر)</label>
            <input
              type="number"
              value={formData.duration_months}
              onChange={(e) => handleInputChange('duration_months', Number(e.target.value))}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">الربح بعد</label>
            <input
              type="number"
              value={formData.profit_after}
              onChange={(e) => handleInputChange('profit_after', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="الربح بعد"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع بالتقسيط</label>
            <input
              type="number"
              value={formData.installment_sale_price}
              onChange={(e) => handleInputChange('installment_sale_price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="سعر البيع بالتقسيط"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">القسط الشهري</label>
            <input
              type="number"
              value={formData.monthly_installment}
              onChange={(e) => handleInputChange('monthly_installment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="القسط الشهري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدخل الشهري</label>
            <input
              type="number"
              value={formData.monthly_income}
              onChange={(e) => handleInputChange('monthly_income', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="الدخل الشهري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كم نقدر نشتري</label>
            <input
              type="number"
              value={formData.purchase_capacity}
              onChange={(e) => handleInputChange('purchase_capacity', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="كم نقدر نشتري"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدخل السنوي</label>
            <input
              type="number"
              value={formData.annual_income}
              onChange={(e) => handleInputChange('annual_income', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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