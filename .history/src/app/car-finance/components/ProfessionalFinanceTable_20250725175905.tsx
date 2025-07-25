'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

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
  annual_profit?: number;
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

interface ProfessionalFinanceTableProps {
  data: FinanceData[];
  onDataChange: (data: FinanceData[]) => void;
}

export default function ProfessionalFinanceTable({ data, onDataChange }: ProfessionalFinanceTableProps) {
  // دالة لحساب رسوم الخدمة التصاعدية
  const calculateServiceFee = (priceCategory: number): number => {
    const basePrice = 20000;
    const baseFee = 2000;
    const incrementPerCategory = 300;
    const maxFee = 3500; // الحد الأقصى لرسوم الخدمة
    const maxPriceCategory = 45000; // الفئة السعرية التي تتوقف عندها الزيادة
    
    if (priceCategory <= basePrice) {
      return baseFee;
    }
    
    // حساب عدد الفئات التي تجاوزناها
    const categoryDifference = priceCategory - basePrice;
    const categorySteps = Math.floor(categoryDifference / 5000); // كل 5000 ريال = فئة جديدة
    
    const calculatedFee = baseFee + (categorySteps * incrementPerCategory);
    
    // إذا تجاوزت الفئة السعرية 45,000 ريال، استخدم الحد الأقصى
    if (priceCategory >= maxPriceCategory) {
      return maxFee;
    }
    
    return calculatedFee;
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<FinanceData | null>(null);

  const handleEdit = (row: FinanceData) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const handleSave = () => {
    if (editData) {
      // تطبيق رسوم الخدمة التصاعدية
      const serviceFee = calculateServiceFee(editData.price_category);
      
      let profit: number;
      
      // الطريقة المختلطة: للفئات 20,000 و 25,000 نحسب الربح من الفئة السعرية كاملة
      // وللفئات 30,000 وما فوق نحسب الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
      if (editData.price_category <= 25000) {
        // للفئات 20,000 و 25,000: الربح من الفئة السعرية كاملة
        profit = editData.price_category * (editData.profit_percent / 100);
      } else {
        // للفئات 30,000 وما فوق: الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
        const baseAmount = editData.price_category - serviceFee - editData.last_payment;
        profit = baseAmount * (editData.profit_percent / 100);
      }
      
      // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
      const totalAmount = editData.price_category + profit;
      
      // حساب القسط الشهري = (سعر البيع بالتقسيط - رسوم خدمة - الدفعة الأخيرة + تكلفة التأمين + التكاليف الثابتة السنوية) ÷ مدة التمويل
      const remainingAmount = totalAmount - serviceFee - editData.last_payment;
      const insuranceCost = (editData.price_category * 0.08 * editData.duration_months) / 12;
      const fixedCostsAnnual = 300 * 12; // التكاليف الثابتة السنوية
      const totalRemainingAmount = remainingAmount + insuranceCost + fixedCostsAnnual;
      const monthlyInstallment = totalRemainingAmount / editData.duration_months;
      
      // حساب الدخل الشهري = القسط الشهري × عدد السيارات
      const monthlyIncome = monthlyInstallment * editData.car_count;
      
      // حساب كم نقدر نشتري = الفئة السعرية × عدد السيارات
      const purchaseCapacity = editData.price_category * editData.car_count;
      
      // حساب الدخل السنوي = الدخل الشهري × 12
      const annualIncome = monthlyIncome * 12;
      
      // حساب الربح السنوي
      let annualProfit: number;
      if (editData.duration_months === 12) {
        // للفترات 12 شهر: نأخذ الربح كاملاً
        annualProfit = profit;
      } else {
        // للفترات الأطول: نحسب الربح السنوي فقط
        annualProfit = profit * (12 / editData.duration_months);
      }
      
      const updatedData = {
        ...editData,
        first_payment: serviceFee, // تحديث رسوم الخدمة
        profit_after: Math.round(profit),
        installment_sale_price: Math.round(totalAmount),
        monthly_installment: Math.round(monthlyInstallment),
        monthly_income: Math.round(monthlyIncome),
        purchase_capacity: purchaseCapacity,
        annual_income: Math.round(annualIncome),
        annual_profit: Math.round(annualProfit) // إضافة الربح السنوي
      };

      const updatedDataArray = data.map(item => 
        item.id === updatedData.id ? updatedData : item
      );
      onDataChange(updatedDataArray);
      setEditingId(null);
      setEditData(null);
    }
  };

  // تطبيق المعادلات على جميع البيانات عند تحميل الجدول
  const applyFormulasToData = (data: FinanceData[]) => {
    return data.map(item => {
      // تطبيق رسوم الخدمة التصاعدية
      const serviceFee = calculateServiceFee(item.price_category);
      
      let profit: number;
      
      // الطريقة المختلطة: للفئات 20,000 و 25,000 نحسب الربح من الفئة السعرية كاملة
      // وللفئات 30,000 وما فوق نحسب الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
      if (item.price_category <= 25000) {
        // للفئات 20,000 و 25,000: الربح من الفئة السعرية كاملة
        profit = item.price_category * (item.profit_percent / 100);
      } else {
        // للفئات 30,000 وما فوق: الربح من (الفئة السعرية - رسوم خدمة - الدفعة الأخيرة)
        const baseAmount = item.price_category - serviceFee - item.last_payment;
        profit = baseAmount * (item.profit_percent / 100);
      }
      
      // حساب سعر البيع بالتقسيط = الفئة السعرية + الربح
      const totalAmount = item.price_category + profit;
      
      // حساب القسط الشهري = (سعر البيع بالتقسيط - رسوم خدمة - الدفعة الأخيرة + تكلفة التأمين + التكاليف الثابتة السنوية) ÷ مدة التمويل
      const remainingAmount = totalAmount - serviceFee - item.last_payment;
      const insuranceCost = (item.price_category * 0.08 * item.duration_months) / 12;
      const fixedCostsAnnual = 300 * 12; // التكاليف الثابتة السنوية
      const totalRemainingAmount = remainingAmount + insuranceCost + fixedCostsAnnual;
      const monthlyInstallment = totalRemainingAmount / item.duration_months;
      
      // حساب الدخل الشهري = القسط الشهري × عدد السيارات
      const monthlyIncome = monthlyInstallment * item.car_count;
      
      // حساب كم نقدر نشتري = الفئة السعرية × عدد السيارات
      const purchaseCapacity = item.price_category * item.car_count;
      
      // حساب الدخل السنوي = الدخل الشهري × 12
      const annualIncome = monthlyIncome * 12;
      
      // حساب الربح السنوي
      let annualProfit: number;
      if (item.duration_months === 12) {
        // للفترات 12 شهر: نأخذ الربح كاملاً
        annualProfit = profit;
      } else {
        // للفترات الأطول: نحسب الربح السنوي فقط
        annualProfit = profit * (12 / item.duration_months);
      }
      
      return {
        ...item,
        first_payment: serviceFee, // تحديث رسوم الخدمة
        profit_after: Math.round(profit),
        installment_sale_price: Math.round(totalAmount),
        monthly_installment: Math.round(monthlyInstallment),
        monthly_income: Math.round(monthlyIncome),
        purchase_capacity: purchaseCapacity,
        annual_income: Math.round(annualIncome),
        annual_profit: Math.round(annualProfit) // إضافة الربح السنوي
      };
    });
  };

  // تطبيق المعادلات على البيانات
  const calculatedData = applyFormulasToData(data);

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
      const updatedData = data.filter(item => item.id !== id);
      onDataChange(updatedData);
    }
  };

  // تنسيق الأرقام بالإنجليزية
  const formatNumber = (num: number) => num.toLocaleString('en-US');
  const formatPercent = (num: number) => `${num}%`;

  const groupedData = calculatedData.reduce((acc, item) => {
    const key = `${item.profit_percent}-${item.duration_months}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, FinanceData[]>);

  const getCellStyle = (field: keyof FinanceData, value: number) => {
    if (field.includes('percent')) {
      return 'text-blue-600 font-semibold'; // أزرق للنسب المئوية
    }
    if (field.includes('income') || field.includes('profit')) {
      return 'text-green-600 font-semibold'; // أخضر للدخل والربح
    }
    if (field.includes('cost') || field.includes('payment')) {
      return 'text-orange-600 font-semibold'; // برتقالي للتكاليف والمدفوعات
    }
    if (field.includes('price') || field.includes('sale')) {
      return 'text-purple-600 font-semibold'; // بنفسجي للأسعار
    }
    if (field.includes('count') || field.includes('quantity')) {
      return 'text-indigo-600 font-semibold'; // نيلي للأعداد
    }
    return 'text-gray-700 font-medium'; // رمادي للباقي
  };

  const renderCell = (item: FinanceData, field: keyof FinanceData) => {
    if (editingId === item.id && editData) {
      return (
        <input
          type="number"
          value={editData[field] as number}
          onChange={(e) => setEditData({
            ...editData,
            [field]: Number(e.target.value)
          })}
          className="w-full px-2 py-1 border rounded text-center bg-yellow-50 focus:bg-white"
          title={`تعديل ${field}`}
        />
      );
    }

    const value = item[field];
    if (typeof value === 'number') {
      const style = getCellStyle(field, value);
      if (field.includes('percent')) {
        return <span className={style}>{formatPercent(value)}</span>;
      }
      return <span className={style}>{formatNumber(value)}</span>;
    }
    return <span className="text-gray-700">{value}</span>;
  };

  // دالة تصدير البيانات إلى Excel
  const handleExportToExcel = () => {
    // الأعمدة المطلوبة بالعربية
    const headers = [
      'الفئة السعرية',
      'عدد السيارات',
      'رسوم خدمة',
      'دفعة أخيرة',
      'الربح الأساسي',
      'الربح السنوي',
      'سعر البيع بالتقسيط',
      'القسط الشهري',
      'الدخل الشهري',
      'كم نقدر نشتري',
      'الدخل السنوي',
      'تكاليف التأمين شامل',
      'تكاليف ثابتة شهرياً',
    ];
    const rows = calculatedData.map(row => ([
      row.price_category,
      row.car_count,
      row.first_payment,
      row.last_payment,
      row.profit_after,
      row.annual_profit,
      row.installment_sale_price,
      row.monthly_installment,
      row.monthly_income,
      row.purchase_capacity,
      row.annual_income,
      row.tracking_cost,
      row.inspection_cost
    ]));
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'قواعد التمويل الاحترافي');
    XLSX.writeFile(workbook, 'جدول_قواعد_التمويل_الاحترافي.xlsx');
  };

  // احذف أي كود form أو حالة form أو دوال handleFormChange/handleFormSubmit الخاصة بالنموذج من هذا المكون نهائياً

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleExportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs"
        >
          تصدير إلى Excel
        </button>
      </div>
      {/* نموذج الإدخال دائماً في الأعلى */}
      {/* الجداول المجمعة */}
      {Object.entries(groupedData).map(([key, items]) => {
        const [profitPercent, durationMonths] = key.split('-').map(Number);
        return (
          <div key={key} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                نسبة الربح: {profitPercent}% - مدة التمويل: {durationMonths} شهر
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الفئة السعرية
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد السيارات
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رسوم خدمة
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      دفعة أخيرة
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الربح الأساسي
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الربح السنوي
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      سعر البيع بالتقسيط
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القسط الشهري
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدخل الشهري
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      كم نقدر نشتري
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدخل السنوي
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تكاليف ثابتة شهرياً
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تكاليف التأمين الشامل
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تعديل
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'price_category')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'car_count')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'first_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'last_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'profit_after')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100 bg-green-50 text-green-700 font-semibold">
                        {formatNumber(item.annual_profit || 0)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'installment_sale_price')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'monthly_installment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'monthly_income')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'purchase_capacity')}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {formatNumber(item.annual_income)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-orange-600 font-semibold">
                        300
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-orange-600 font-semibold">
                        {Math.round((item.price_category * 0.08 * item.duration_months) / 12)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium">
                        {editingId === item.id ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={handleSave}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      
      {/* قسم معادلات الحساب - في نهاية الصفحة */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 معادلات الحساب:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="mb-1"><strong>الربح الأساسي =</strong> الفئة السعرية × نسبة الربح</p>
            <p className="mb-1"><strong>سعر البيع بالتقسيط =</strong> الفئة السعرية + الربح الأساسي</p>
            <p className="mb-1"><strong>القسط الشهري =</strong> (سعر البيع بالتقسيط - رسوم خدمة - الدفعة الأخيرة + تكلفة التأمين + التكاليف الثابتة السنوية) ÷ مدة التمويل</p>
            <p className="mb-1"><strong>الدخل الشهري =</strong> القسط الشهري × عدد السيارات</p>
            <p className="mb-1"><strong>كم نقدر نشتري =</strong> الفئة السعرية × عدد السيارات</p>
            <p className="mb-1"><strong>الدخل السنوي =</strong> الدخل الشهري × 12</p>
          </div>
          <div>
            <p className="mb-1"><strong>التكاليف الثابتة الشهرية =</strong> 300 ريال</p>
            <p className="mb-1"><strong>تكاليف التأمين الشامل =</strong> (الفئة السعرية × 8% × مدة التمويل) ÷ 12</p>
            <p className="mb-1 text-xs">تشمل: تكلفة التتبع، تكلفة عقد ضامن، تكلفة الفحص الفني، توزيع الراتب، توزيع الإيجار</p>
          </div>
        </div>
      </div>
    </div>
  );
} 