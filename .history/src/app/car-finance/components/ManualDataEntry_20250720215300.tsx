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
  last_payment_percent: number;
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
  // دالة لحساب رسوم الخدمة التصاعدية
  const calculateServiceFee = (priceCategory: number): number => {
    const basePrice = 20000;
    const baseFee = 2000;
    const incrementPerCategory = 300;
    
    if (priceCategory <= basePrice) {
      return baseFee;
    }
    
    // حساب عدد الفئات التي تجاوزناها
    const categoryDifference = priceCategory - basePrice;
    const categorySteps = Math.floor(categoryDifference / 5000); // كل 5000 ريال = فئة جديدة
    
    return baseFee + (categorySteps * incrementPerCategory);
  };

  const [formData, setFormData] = useState<Partial<FinanceData>>({
    profit_percent: 30,
    duration_months: 12,
    price_category: 20000,
    car_count: 1,
    first_payment_percent: 0,
    first_payment: calculateServiceFee(20000), // رسوم خدمة محسوبة تلقائياً
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





  const handleLastPaymentPercentChange = (percent: number) => {
    const lastPaymentValue = (formData.price_category! * percent) / 100;
    setFormData(prev => ({
      ...prev,
      last_payment_percent: percent,
      last_payment: Math.round(lastPaymentValue)
    }));
  };

  const handleInputChange = (field: keyof FinanceData, value: number) => {
    const newFormData = {
      ...formData,
      [field]: value
    };

    // تطبيق جميع المعادلات عند تغيير أي قيمة
    if (field === 'price_category' || field === 'profit_percent' || field === 'first_payment' || field === 'last_payment' || field === 'duration_months' || field === 'car_count') {
      let profit: number;
      
      // الطريقة المختلطة: للفئات 20,000 و 25,000 نحسب الربح من الفئة السعرية كاملة
      // وللفئات 30,000 وما فوق نحسب الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
      if (newFormData.price_category! <= 25000) {
        // للفئات 20,000 و 25,000: الربح من الفئة السعرية كاملة
        profit = newFormData.price_category! * (newFormData.profit_percent! / 100);
      } else {
        // للفئات 30,000 وما فوق: الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
        const baseAmount = newFormData.price_category! - newFormData.first_payment! - newFormData.last_payment!;
        profit = baseAmount * (newFormData.profit_percent! / 100);
      }
      
      // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
      const totalAmount = newFormData.price_category! + profit;
      
      // حساب القسط الشهري = (سعر البيع بالتقسيط - الدفعة الأولى - الدفعة الأخيرة + تكلفة التأمين + التكاليف الثابتة السنوية) ÷ مدة التمويل
      const remainingAmount = totalAmount - newFormData.first_payment! - newFormData.last_payment!;
      const insuranceCost = (newFormData.price_category! * 0.08 * newFormData.duration_months!) / 12;
      const fixedCostsAnnual = 300 * 12; // التكاليف الثابتة السنوية
      const totalRemainingAmount = remainingAmount + insuranceCost + fixedCostsAnnual;
      const monthlyInstallment = totalRemainingAmount / newFormData.duration_months!;
      
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
    
    let profit: number;
    
    // الطريقة المختلطة: للفئات 20,000 و 25,000 نحسب الربح من الفئة السعرية كاملة
    // وللفئات 30,000 وما فوق نحسب الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
    if (formData.price_category! <= 25000) {
      // للفئات 20,000 و 25,000: الربح من الفئة السعرية كاملة
      profit = formData.price_category! * (formData.profit_percent! / 100);
    } else {
      // للفئات 30,000 وما فوق: الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
      const baseAmount = formData.price_category! - formData.first_payment! - formData.last_payment!;
      profit = baseAmount * (formData.profit_percent! / 100);
    }
    
    // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
    const totalAmount = formData.price_category! + profit;
    
    // حساب القسط الشهري = (سعر البيع بالتقسيط - رسوم خدمة - الدفعة الأخيرة + تكلفة التأمين + التكاليف الثابتة السنوية) ÷ مدة التمويل
    const remainingAmount = totalAmount - formData.first_payment! - formData.last_payment!;
    const insuranceCost = (formData.price_category! * 0.08 * formData.duration_months!) / 12;
    const fixedCostsAnnual = 300 * 12; // التكاليف الثابتة السنوية
    const totalRemainingAmount = remainingAmount + insuranceCost + fixedCostsAnnual;
    const monthlyInstallment = totalRemainingAmount / formData.duration_months!;
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
      first_payment_percent: 0,
      first_payment: 0,
      last_payment: formData.last_payment || 3000,
      last_payment_percent: formData.last_payment_percent || 10,
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
      first_payment_percent: 0,
      first_payment: 0,
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
        <div className="grid grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              الفئة السعرية
            </label>
            <select
              value={formData.price_category}
              onChange={(e) => handleInputChange('price_category', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="الفئة السعرية"
            >
              <option value={20000}>20,000 ريال</option>
              <option value={25000}>25,000 ريال</option>
              <option value={30000}>30,000 ريال</option>
              <option value={35000}>35,000 ريال</option>
              <option value={40000}>40,000 ريال</option>
              <option value={45000}>45,000 ريال</option>
              <option value={50000}>50,000 ريال</option>
              <option value={55000}>55,000 ريال</option>
              <option value={60000}>60,000 ريال</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              مدة التمويل
            </label>
            <select
              value={formData.duration_months}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="مدة التمويل"
            >
              <option value={12}>12 شهر</option>
              <option value={18}>18 شهر</option>
              <option value={24}>24 شهر</option>
              <option value={30}>30 شهر</option>
              <option value={36}>36 شهر</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              نسبة الربح
            </label>
            <select
              value={formData.profit_percent}
              onChange={(e) => handleProfitChange(Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xs font-medium text-gray-700 mb-1">عدد السيارات</label>
            <input
              type="number"
              value={formData.car_count}
              onChange={(e) => handleInputChange('car_count', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="عدد السيارات"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">نسبة الدفعة الأخيرة</label>
            <select
              value={formData.last_payment_percent || 10}
              onChange={(e) => handleLastPaymentPercentChange(Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="نسبة الدفعة الأخيرة"
            >
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={25}>25%</option>
              <option value={30}>30%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">دفعة أخيرة</label>
            <input
              type="number"
              value={formData.last_payment}
              readOnly
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-semibold"
              title="دفعة أخيرة"
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