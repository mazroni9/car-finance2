'use client';

import React, { useState, useEffect, useRef } from 'react';
import FinanceSummary from './components/FinanceSummary';
import ProfessionalFinanceTable, { ExportButton } from './components/ProfessionalFinanceTable';
import ExcelUploader from './components/ExcelUploader';
import ManualDataEntry from './components/ManualDataEntry';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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

export default function CarFinancePage() {
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

  // البيانات الافتراضية
  const defaultData: FinanceData[] = [
    {
      id: 'new_1',
      profit_percent: 30,
      duration_months: 12,
      price_category: 20000,
      car_count: 1,
      first_payment_percent: 0,
      first_payment: calculateServiceFee(20000),
      last_payment: 2000,
      profit_after: 6000,
      annual_profit: 6000,
      installment_sale_price: 26000,
      monthly_installment: 1750,
      monthly_income: 1750,
      purchase_capacity: 20000,
      annual_income: 21000,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    },
    {
      id: 'new_2',
      profit_percent: 40,
      duration_months: 24,
      price_category: 25000,
      car_count: 3,
      first_payment_percent: 0,
      first_payment: calculateServiceFee(25000),
      last_payment: 2500,
      profit_after: 10000,
      annual_profit: 5000,
      installment_sale_price: 35000,
      monthly_installment: 1250,
      monthly_income: 3750,
      purchase_capacity: 75000,
      annual_income: 45000,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    },
    {
      id: 'new_3',
      profit_percent: 50,
      duration_months: 36,
      price_category: 30000,
      car_count: 10,
      first_payment_percent: 0,
      first_payment: calculateServiceFee(30000),
      last_payment: 3000,
      profit_after: 15000,
      annual_profit: 5000,
      installment_sale_price: 45000,
      monthly_installment: 1000,
      monthly_income: 10000,
      purchase_capacity: 300000,
      annual_income: 120000,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    }
  ];

  const [financeData, setFinanceData] = useState<FinanceData[]>(defaultData);
  const [isClient, setIsClient] = useState(false);

  // التأكد من أن الكود يعمل فقط في المتصفح
  useEffect(() => {
    setIsClient(true);
    
    // تحميل البيانات من localStorage
    const saved = localStorage.getItem('financeData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFinanceData(parsedData);
      } catch {
        // إذا كان هناك خطأ في البيانات المحفوظة، استخدم الافتراضي
        setFinanceData(defaultData);
      }
    }
  }, []);

  const [showBackupNotice, setShowBackupNotice] = useState<string | null>(null);

  // حفظ تلقائي في LocalStorage عند كل تغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('financeData', JSON.stringify(financeData));
      // حفظ نسخة احتياطية تلقائية
      localStorage.setItem('financeData_backup', JSON.stringify(financeData));
    }
  }, [financeData]);

  const handleDataChange = (newData: FinanceData[]) => {
    setFinanceData(newData);
  };

  const handleDataImport = (importedData: FinanceData[]) => {
    setFinanceData(importedData);
  };

  const handleAddData = (newData: FinanceData) => {
    setFinanceData(prev => [...prev, newData]);
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
      setFinanceData([]);
      // مسح البيانات من LocalStorage أيضاً
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeData');
      }
    }
  };

  const handleResetData = () => {
    if (confirm('هل تريد إعادة تعيين البيانات إلى القيم الافتراضية؟')) {
      // مسح البيانات القديمة
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeData');
      }
      // إعادة تحميل الصفحة
      window.location.reload();
    }
  };

  // حساب المجاميع من البيانات الفعلية
  const calculateSummary = (data: FinanceData[]) => {
    if (data.length === 0) {
      return {
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_down_payment: 0,
        total_last_payment: 0,
        total_last_payment_all_contracts: 0,
        total_service_fees: 0,
        total_annual_profit_before_costs: 0,
        total_profit_full_period: 0,
        total_purchase_cost: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
        leased_cars_count: 0
      };
    }

    // حساب إجمالي تكلفة الشراء السنوية من أعمدة "كم نقدر نشتري"
    const total_purchase_cost = data.reduce((sum, item) => sum + (item.purchase_capacity || 0), 0);
    
    // حساب باقي المجاميع
    const total_monthly_installments = data.reduce((sum, item) => sum + (item.monthly_income || 0), 0);
    
    // حساب إجمالي الدخل السنوي من عمود "الدخل السنوي" في الجداول
    const total_annual_income = data.reduce((sum, item) => sum + (item.annual_income || 0), 0);
    
    const total_down_payment = data.reduce((sum, item) => sum + (item.first_payment || 0), 0);
    // إجمالي الدفعات الأخيرة السنوية (فقط العقود السنوية)
    const total_last_payment = data.reduce(
      (sum, item) =>
        item.duration_months === 12
          ? sum + (item.last_payment || 0) * (item.car_count || 1)
          : sum,
      0
    );

    // إجمالي الدفعات الأخيرة لكل العقود (جميع المدد)
    const total_last_payment_all_contracts = data.reduce(
      (sum, item) => sum + (item.last_payment || 0) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي رسوم الخدمة
    const total_service_fees = data.reduce(
      (sum, item) => sum + (item.first_payment || 0) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي الربح السنوي من عمود "الربح السنوي" في الجداول + رسوم الخدمة
    const total_annual_profit_before_costs = financeData.reduce(
      (sum, item) =>
        sum + ((item.annual_profit || 0) + (item.first_payment || 0)) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي الربح الكامل (يشمل رسوم الخدمة)
    const total_profit_full_period = financeData.reduce(
      (sum, item) => sum + (((item.profit_after || 0) + (item.first_payment || 0)) * (item.car_count || 1)),
      0
    );
    
    // حساب متوسط ROI (يشمل رسوم الخدمة)
    const avg_roi_full_period = total_purchase_cost > 0 ? (total_profit_full_period / total_purchase_cost) : 0;
    const avg_roi_annual = total_purchase_cost > 0
      ? ((total_annual_profit_before_costs + total_service_fees) / total_purchase_cost)
      : 0;

    // حساب إجمالي عدد السيارات
    const leased_cars_count = data.reduce((sum, item) => sum + (item.car_count || 0), 0);

    return {
      total_monthly_installments,
      total_annual_income,
      total_down_payment,
      total_last_payment,
      total_last_payment_all_contracts,
      total_service_fees,
      total_annual_profit_before_costs,
      total_profit_full_period,
      total_purchase_cost,
      avg_roi_full_period,
      avg_roi_annual,
      leased_cars_count
    };
  };

  const summary = calculateSummary(financeData);

  // حالة النموذج ودواله
  const [form, setForm] = useState({
    price_category: 20000,
    duration_months: 12,
    car_count: 1,
    profit_percent: 30,
    last_payment_percent: 0.1,
    last_payment: 2000,
  });
  const profitPercentByDuration: Record<number, number> = {
    12: 30,
    18: 40,
    24: 45,
    30: 50,
    36: 55,
    42: 60,
  };
  const lastPaymentPercents = [0.1, 0.15, 0.2, 0.25, 0.3];
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: name === 'car_count' || name === 'price_category' || name === 'duration_months' ? Number(value) : value };
    if (name === 'duration_months') {
      newForm.profit_percent = profitPercentByDuration[Number(value)] || 30;
    }
    if (name === 'price_category' || name === 'last_payment_percent') {
      const percent = name === 'last_payment_percent' ? Number(value) : newForm.last_payment_percent;
      newForm.last_payment = Math.round(newForm.price_category * percent);
      if (name === 'last_payment_percent') newForm.last_payment_percent = percent;
    }
    setForm(newForm);
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newData: FinanceData = {
      id: Math.random().toString(36).slice(2, 8),
      profit_percent: form.profit_percent,
      duration_months: form.duration_months,
      price_category: form.price_category,
      car_count: form.car_count,
      first_payment_percent: 0,
      first_payment: calculateServiceFee(form.price_category),
      last_payment: form.last_payment,
      profit_after: 0,
      annual_profit: 0,
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
    };
    setFinanceData([newData, ...financeData]);
    setForm({ ...form, car_count: 1 });
  };

  // احذف بطاقة زر تصدير PDF المستقلة خارج الملخص المالي بالكامل

  // زر استعادة النسخة الاحتياطية
  const handleRestoreBackup = () => {
    if (typeof window !== 'undefined') {
      const backup = localStorage.getItem('financeData_backup');
      if (backup) {
        try {
          const parsed = JSON.parse(backup);
          setFinanceData(parsed);
          setShowBackupNotice('تمت استعادة النسخة الاحتياطية بنجاح!');
        } catch {
          setShowBackupNotice('فشل في قراءة النسخة الاحتياطية!');
        }
      } else {
        setShowBackupNotice('لا توجد نسخة احتياطية محفوظة!');
      }
      setTimeout(() => setShowBackupNotice(null), 3000);
    }
  };

  // قائمة الفئات السعرية المعروفة من 20000 إلى 60000 بفارق 5000
  const knownPriceCategories = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000];
  const [customPrice, setCustomPrice] = useState(0);

  // نهاية جميع الدوال والتعليقات

  const handleExportToExcel = () => {
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
    const rows = financeData.map(row => ([
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
      // احسب القيمتين مباشرة:
      Math.round((row.price_category * 0.08 * row.duration_months) / 12), // تكاليف التأمين شامل
      300 // تكاليف ثابتة شهرياً
    ]));
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'قواعد التمويل الاحترافي');
    XLSX.writeFile(workbook, 'جدول_قواعد_التمويل_الاحترافي.xlsx');
  };

  // عدم عرض الكومبوننت حتى يتم تحميل البيانات في المتصفح
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-900">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* عنوان رئيسي للصفحة */}
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900 tracking-wide">نظام التمويل التأجيري التقليدي</h1>
      {/* ملخص التمويل */}
      <FinanceSummary summary={summary} />
      {/* فاصل جمالي */}
      <div className="my-8 border-t-2 border-blue-200" />
      {/* إشعار النسخة الاحتياطية */}
      {showBackupNotice && (
        <div className="mb-4 text-center">
          <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded shadow">{showBackupNotice}</span>
        </div>
      )}
      {/* نموذج الإدخال */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-end gap-4 relative">
        {/* زر استعادة النسخة الاحتياطية في أقصى طرف البطاقة */}
        <button
          type="button"
          onClick={handleRestoreBackup}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors absolute top-4 left-4 md:static md:ml-2 order-last"
        >
          استعادة النسخة الاحتياطية
        </button>
        <div className="flex flex-col" style={{ minWidth: '110px', maxWidth: '160px', width: '100%' }}>
          <label className="font-bold mb-1">الفئة السعرية</label>
          <select
            name="price_category"
            value={form.price_category}
            onChange={e => setForm({ ...form, price_category: Number(e.target.value) })}
            className="border rounded px-2 py-1 text-base font-bold" title="الفئة السعرية"
            style={{ minWidth: '110px', maxWidth: '160px', width: '100%' }}
          >
            {knownPriceCategories.map((cat) => (
              <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-bold mb-1">مدة العقد (شهر)</label>
          <select name="duration_months" value={form.duration_months} onChange={handleFormChange} className="border rounded px-2 py-1" title="مدة العقد">
            <option value={12}>12</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
            <option value={30}>30</option>
            <option value={36}>36</option>
            <option value={42}>42</option>
          </select>
        </div>
        <div className="flex flex-col" style={{ maxWidth: '70px', flex: '0 0 70px' }}>
          <label className="font-bold mb-1">عدد السيارات</label>
          <input type="number" name="car_count" value={form.car_count} onChange={handleFormChange} className="border rounded px-2 py-1 text-center" min={1} required title="عدد السيارات" placeholder="عدد" style={{ maxWidth: '70px' }} />
        </div>
        <div className="flex flex-col">
          <label className="font-bold mb-1">نسبة الربح (%)</label>
          <input type="number" name="profit_percent" value={form.profit_percent} onChange={handleFormChange} className="border rounded px-2 py-1" min={0} max={100} required title="نسبة الربح" placeholder="أدخل نسبة الربح" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold mb-1">نسبة الدفعة الأخيرة</label>
          <select name="last_payment_percent" value={form.last_payment_percent} onChange={handleFormChange} className="border rounded px-2 py-1" title="نسبة الدفعة الأخيرة">
            {lastPaymentPercents.map((p) => (
              <option key={p} value={p}>{(p * 100).toFixed(0)}%</option>
            ))}
          </select>
        </div>
        {/* تم حذف حقل مبلغ الدفعة الأخيرة من النموذج */}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors">إضافة</button>
        {/* زر حفظ كامل البيانات */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('financeData', JSON.stringify(financeData));
              setShowBackupNotice('تم حفظ كامل البيانات بنجاح!');
              setTimeout(() => setShowBackupNotice(null), 3000);
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          حفظ كامل البيانات
        </button>
      </form>
      {/* فاصل جمالي */}
      <div className="my-8 border-t-2 border-blue-200" />
      {/* عنوان جدول قواعد التمويل الاحترافي داخل بطاقة مع زر تصدير */}
      <div className="bg-blue-100 rounded-lg shadow-md p-2 mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-purple-900 tracking-wider m-0">جدول قواعد التمويل الاحترافي</h2>
        <div>
          <button
            type="button"
            onClick={handleExportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs"
          >
            تصدير إلى Excel
          </button>
        </div>
      </div>
      {/* جدول قواعد التمويل الاحترافي */}
      <ProfessionalFinanceTable data={financeData} onDataChange={handleDataChange} />
    </div>
  );
}