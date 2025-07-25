"use client";
import React, { useState } from "react";
import MonthlySummaryTable from './MonthlySummaryTable';
import AnnualSummaryTable from './AnnualSummaryTable';

// الفئات السعرية الثابتة (من جدول الإكسل)
const PRICE_CATEGORIES = [
  20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000
];

// أضف دالة لحساب قيمة الرسوم الإدارية حسب الفئة السعرية
function getAdminFee(priceCategory: number) {
  const base = 20000;
  const baseFee = 2000;
  if (priceCategory < base) return baseFee;
  return baseFee + Math.round((priceCategory - base) / 5000) * 250;
}

function calculateRow(form: any, month: string) {
  const price_category = form.priceCategory;
  const duration_months = form.durationMonths;
  const profit_target_percent = 0.3;
  const last_payment_percent = form.lastPaymentPercent;
  const quantity = form.quantity;
  const extra_annual_fee = form.extraAnnualFee;

  const down_payment_value = getAdminFee(price_category);
  const last_payment_value = price_category * last_payment_percent;
  const insurance_value = 2000 * quantity;
  const base_profit = 6000; // ربح ثابت سنوياً 6000 ريال
  
  // الإيجار الشهري = (السعر الأساسي + الربح الأساسي + التأمين + الرسوم السنوية - الدفعة الأخيرة) / مدة الإيجار
  const monthly_rent = (price_category + base_profit + insurance_value + extra_annual_fee - last_payment_value) / duration_months;
  
  // الإيجار الممتد = (قيمة الدفعة الأخيرة × نسبة الربح) + الرسوم السنوية + التأمين + قيمة الدفعة الأخيرة
  const extended_lease_total = (last_payment_value * profit_target_percent) + extra_annual_fee + insurance_value + last_payment_value;
  // عدد أشهر الإيجار الممتد = إجمالي الإيجار الممتد ÷ القسط الشهري
  const extended_lease_months = extended_lease_total / monthly_rent;

  return {
    id: Math.random().toString(36).slice(2, 8),
    price_category,
    duration_months,
    profit_target_percent,
    last_payment_percent,
    quantity,
    down_payment_value,
    last_payment_value,
    insurance_value,
    extra_annual_fee,
    base_profit,
    monthly_rent,
    extended_lease_total,
    extended_lease_months,
    month: month // تأكيد على حفظ الشهر
  };
}

export default function CarLeasingPage() {
  // حالة النموذج
  const [form, setForm] = useState(() => {
    // محاولة تحميل البيانات المحفوظة
    if (typeof window !== 'undefined') {
      const savedForm = localStorage.getItem('carLeasingForm');
      if (savedForm) {
        return JSON.parse(savedForm);
      }
    }
    return {
      priceCategory: PRICE_CATEGORIES[0],
      durationMonths: 12,
      quantity: 1,
      lastPaymentPercent: 0.75,
      extraAnnualFee: 1200,
    };
  });
  
  const [rows, setRows] = useState<any[]>(() => {
    // محاولة تحميل البيانات المحفوظة مع النسخة الاحتياطية
    if (typeof window !== 'undefined') {
      const savedRows = localStorage.getItem('carLeasingRows');
      if (savedRows) {
        return JSON.parse(savedRows);
      }
      // محاولة استعادة من النسخة الاحتياطية
      const backupRows = localStorage.getItem('carLeasingRows_backup');
      if (backupRows) {
        return JSON.parse(backupRows);
      }
    }
    return [];
  });
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // محاولة تحميل الشهر المحفوظ
    if (typeof window !== 'undefined') {
      const savedMonth = localStorage.getItem('carLeasingSelectedMonth');
      if (savedMonth) {
        return savedMonth;
      }
    }
    return 'يناير';
  });

  // الحصول على البيانات الخاصة بالشهر المحدد فقط
  const getMonthRows = () => {
    return rows.filter(row => row.month === selectedMonth);
  };

  // حفظ البيانات في localStorage مع نسخة احتياطية
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
      // حفظ نسخة احتياطية
      localStorage.setItem(key + '_backup', JSON.stringify(data));
    }
  };

  // تحديث الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => {
      const newForm = {
        ...prev,
        [name]: name === "quantity" || name === "extraAnnualFee" ? Number(value) : Number(value)
      };
      saveToLocalStorage('carLeasingForm', newForm);
      return newForm;
    });
  };

  // حساب نسبة الربح تلقائياً
  const profitTargetPercent = 0.3;

  const handleSave = () => {
    setRows((prev: any[]) => {
      const newRow = calculateRow(form, selectedMonth);
      const newRows = [...prev, newRow];
      saveToLocalStorage('carLeasingRows', newRows);
      console.log('تم حفظ البيانات للشهر:', selectedMonth, 'البيانات:', newRow);
      alert(`تم حفظ البيانات بنجاح لشهر ${selectedMonth}`);
      return newRows;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">إضافة بيانات تمويل سيارة (نظام التأجير)</h1>
        {/* نموذج الإدخال */}
        {/* نموذج الإدخال بشكل أفقي بين الملخص الشهري وجدول النتائج */}
        <div className="w-full flex flex-col items-center mb-6">
          <form className="flex flex-wrap gap-2 justify-between items-end bg-white rounded-lg shadow p-3 w-full max-w-5xl">
            <div className="flex flex-col items-start">
              <label htmlFor="priceCategory" className="text-xs font-medium text-gray-900 mb-1">الفئة السعرية</label>
              <select
                id="priceCategory"
                name="priceCategory"
                value={form.priceCategory}
                onChange={handleChange}
                className="px-2 py-1 border rounded text-sm min-w-[130px]"
                dir="rtl"
              >
                {PRICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="durationMonths" className="text-xs font-medium text-gray-900 mb-1">مدة الإيجار</label>
              <select
                id="durationMonths"
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                className="px-2 py-1 border rounded text-sm min-w-[110px]"
                dir="rtl"
              >
                {[12, 18, 24, 30, 36].map((m) => (
                  <option key={m} value={m}>{m} شهر</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="quantity" className="text-xs font-medium text-gray-900 mb-1">عدد السيارات</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={100}
                value={form.quantity}
                onChange={handleChange}
                className="px-2 py-1 border rounded text-sm w-16"
                placeholder="عدد"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="lastPaymentPercent" className="text-xs font-medium text-gray-900 mb-1">نسبة تمديد الإيجار</label>
              <select
                id="lastPaymentPercent"
                name="lastPaymentPercent"
                value={form.lastPaymentPercent}
                onChange={handleChange}
                className="px-2 py-1 border rounded text-sm min-w-[70px]"
                dir="rtl"
              >
                {[0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75].map((v) => (
                  <option key={v} value={v}>{Math.round(v * 100)}%</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="profitTargetPercent" className="text-xs font-medium text-gray-900 mb-1">نسبة الربح</label>
              <input
                id="profitTargetPercent"
                name="profitTargetPercent"
                type="text"
                value={`${(profitTargetPercent * 100).toFixed(0)}%`}
                readOnly
                className="px-2 py-1 border rounded bg-gray-100 text-center font-bold text-sm w-16"
                tabIndex={-1}
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="extraAnnualFee" className="text-xs font-medium text-gray-900 mb-1">رسوم سنوية إضافية</label>
              <input
                id="extraAnnualFee"
                name="extraAnnualFee"
                type="number"
                min={0}
                value={form.extraAnnualFee}
                onChange={handleChange}
                className="px-2 py-1 border rounded text-sm w-20"
                placeholder="رسوم"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs mt-5 order-1 ml-auto"
            >
              حفظ المعلومات
            </button>
            <button
              type="button"
              onClick={() => {
                const password = prompt('لحذف جميع البيانات، أدخل كلمة المرور: "DELETE123"');
                if (password === 'DELETE123') {
                  if (confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                    setRows([]);
                    setForm({
                      priceCategory: PRICE_CATEGORIES[0],
                      durationMonths: 12,
                      quantity: 1,
                      lastPaymentPercent: 0.75,
                      extraAnnualFee: 1200,
                    });
                    setSelectedMonth('يناير');
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('carLeasingRows');
                      localStorage.removeItem('carLeasingForm');
                      localStorage.removeItem('carLeasingSelectedMonth');
                    }
                    alert('تم حذف جميع البيانات بنجاح');
                  }
                } else if (password !== null) {
                  alert('كلمة المرور غير صحيحة');
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs mt-5 order-2 mr-auto"
            >
              حذف جميع البيانات
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('هل تريد استعادة البيانات من النسخة الاحتياطية؟')) {
                  if (typeof window !== 'undefined') {
                    const backupRows = localStorage.getItem('carLeasingRows_backup');
                    const backupForm = localStorage.getItem('carLeasingForm_backup');
                    const backupMonth = localStorage.getItem('carLeasingSelectedMonth_backup');
                    
                    if (backupRows) {
                      setRows(JSON.parse(backupRows));
                      alert('تم استعادة البيانات من النسخة الاحتياطية');
                    }
                    if (backupForm) {
                      setForm(JSON.parse(backupForm));
                    }
                    if (backupMonth) {
                      setSelectedMonth(backupMonth);
                    }
                  }
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs mt-5 order-3"
            >
              استعادة البيانات
            </button>
          </form>
        </div>
      </div>
      {/* عناوين الأشهر */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ].map((month) => (
          <button
            key={month}
            type="button"
            className={`px-4 py-2 rounded border border-blue-700 text-blue-700 bg-white hover:bg-blue-50 focus:bg-blue-700 focus:text-white transition-colors font-bold${selectedMonth === month ? ' bg-blue-700 text-white' : ''}`}
            style={{ minWidth: 70 }}
            onClick={() => {
              console.log('تم تغيير الشهر من', selectedMonth, 'إلى', month);
              setSelectedMonth(month);
              saveToLocalStorage('carLeasingSelectedMonth', month);
            }}
          >
            {month}
          </button>
        ))}
      </div>
      <MonthlySummaryTable rows={rows} selectedMonth={selectedMonth} />
      {/* جدول النتائج بعرض كامل */}
      <div className="w-full mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full">
          <h2 className="text-lg font-bold mb-4 text-black">جدول النتائج - {selectedMonth}</h2>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full w-full text-sm text-center border border-blue-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-blue-200 px-2 font-bold">id</th>
                  <th className="border border-blue-200 px-2 font-bold">الفئة السعرية</th>
                  <th className="border border-blue-200 px-2 font-bold">مدة الإيجار</th>
                  <th className="border border-blue-200 px-2 font-bold">نسبة الربح</th>
                  <th className="border border-blue-200 px-2 font-bold">الربح الأساسي</th>
                  <th className="border border-blue-200 px-2 font-bold">نسبة تمديد الإيجار</th>
                  <th className="border border-blue-200 px-2 font-bold">عدد السيارات</th>
                  <th className="border border-blue-200 px-2 font-bold">التأمين</th>
                  <th className="border border-blue-200 px-2 font-bold">قيمة الرسوم الإدارية</th>
                  <th className="border border-blue-200 px-2 font-bold">قيمة الإيجار الممتد</th>
                  <th className="border border-blue-200 px-2 font-bold">الإيجار الشهري</th>
                  <th className="border border-blue-200 px-2 font-bold">الإيجارات السنوية</th>
                  <th className="border border-blue-200 px-2 font-bold">إجمالي الإيجار الممتد</th>
                  <th className="border border-blue-200 px-2 font-bold">عدد أشهر الإيجار الممتد</th>
                  <th className="border border-blue-200 px-2 font-bold">إجمالي مدة الإيجار</th>
                  <th className="border border-blue-200 px-2 font-bold">حذف</th>
                </tr>
              </thead>
              <tbody>
                {getMonthRows().map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={
                      (idx % 2 === 0 ? "bg-white" : "bg-blue-50") +
                      " hover:bg-blue-100 transition-colors text-center"
                    }
                  >
                    <td className="border border-blue-200 px-2 text-black">{row.id}</td>
                    <td className="border border-blue-200 px-2 text-black">{row.price_category.toLocaleString()}</td>
                    <td className="border border-blue-200 px-2 text-black">{row.duration_months}</td>
                    <td className="border border-blue-200 px-2 text-black">{(row.profit_target_percent * 100).toFixed(0)}%</td>
                    <td className="border border-blue-200 px-2 text-black font-bold">{row.base_profit.toLocaleString()}</td>
                    <td className="border border-blue-200 px-2 text-black">{(row.last_payment_percent * 100).toFixed(0)}%</td>
                    <td className="border border-blue-200 px-2 text-black">{row.quantity}</td>
                    <td className="border border-blue-200 px-2 text-black">{row.insurance_value.toLocaleString()}</td>
                    <td className="border border-blue-200 px-2 text-black">{row.down_payment_value.toLocaleString()}</td>
                    <td className="border border-blue-200 px-2 text-black">{row.last_payment_value.toLocaleString()}</td>
                    <td className="border border-blue-200 px-2 text-green-800 bg-green-50 font-extrabold text-lg">{row.monthly_rent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td className="border border-blue-200 px-2 text-green-900 bg-green-100 font-extrabold">{(row.monthly_rent * 12).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td className="border border-blue-200 px-2 text-purple-900 bg-purple-100 font-bold">{row.extended_lease_total.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td className="border border-blue-200 px-2 text-purple-900 bg-purple-100 font-bold">{row.extended_lease_months.toLocaleString(undefined, {maximumFractionDigits: 1})}</td>
                    <td className="border border-blue-200 px-2 text-blue-900 bg-blue-100 font-bold">{(row.extended_lease_months + 12).toLocaleString(undefined, {maximumFractionDigits: 1})}</td>
                    <td className="border border-blue-200 px-2">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white rounded px-2 py-1 text-xs font-bold"
                        onClick={() => {
                          const newRows = rows.filter(r => r.id !== row.id);
                          setRows(newRows);
                          saveToLocalStorage('carLeasingRows', newRows);
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
                {getMonthRows().length > 0 && (
                  <tr className="bg-green-200 font-bold">
                    <td className="border border-blue-200 px-2 text-black" colSpan={4}></td>
                    <td className="border border-blue-200 px-2 text-black font-bold">
                      {getMonthRows().reduce((sum, r) => sum + r.base_profit, 0).toLocaleString()}
                    </td>
                    <td className="border border-blue-200 px-2 text-black" colSpan={1}></td>
                    <td className="border border-blue-200 px-2 text-black font-bold">
                      {getMonthRows().reduce((sum, r) => sum + r.quantity, 0)}
                    </td>
                    <td className="border border-blue-200 px-2 text-black" colSpan={3}></td>
                    <td className="border border-blue-200 px-2 text-green-800 bg-green-100 font-extrabold text-lg">
                      {getMonthRows().reduce((sum, r) => sum + r.monthly_rent, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </td>
                    <td className="border border-blue-200 px-2 text-green-900 bg-green-200 font-extrabold">
                      {getMonthRows().reduce((sum, r) => sum + r.monthly_rent * 12, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </td>
                    <td className="border border-blue-200 px-2 text-purple-900 bg-purple-200 font-extrabold">
                      {getMonthRows().reduce((sum, r) => sum + r.extended_lease_total, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </td>
                    <td className="border border-blue-200 px-2 text-black" colSpan={2}></td>
                  </tr>
                )}
                {getMonthRows().length === 0 && (
                  <tr>
                    <td colSpan={16} className="text-gray-400 py-8">
                      لا توجد بيانات لشهر {selectedMonth} بعد. أدخل البيانات أعلاه واضغط حفظ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <AnnualSummaryTable rows={rows} /> */}
    </div>
  );
} 