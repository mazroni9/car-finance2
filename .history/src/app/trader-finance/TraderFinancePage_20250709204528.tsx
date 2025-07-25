"use client";
import { useState, useEffect } from 'react';
import BasicTable from './basic-table';
import DetailsTable from './details-table';

export default function TraderFinancePage() {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const [selectedMonth, setSelectedMonth] = useState('يناير');

  const [entries, setEntries] = useState([
    { financingRate: 25, monthlySubscription: 500 },
    { financingRate: 50, monthlySubscription: 1000 },
    { financingRate: 75, monthlySubscription: 1500 },
    { financingRate: 100, monthlySubscription: 2000 }
  ]);

  const [monthlyDetails, setMonthlyDetails] = useState(
    months.reduce((acc, month) => {
      acc[month] = [];
      return acc;
    }, {})
  );

  const [saveMessage, setSaveMessage] = useState('');

  // ✅ اقرأ من LocalStorage عند التحميل
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyDetails');
      if (stored) {
        setMonthlyDetails(JSON.parse(stored));
      }
    }
  }, []);

  // ✅ احفظ في LocalStorage عند التغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyDetails', JSON.stringify(monthlyDetails));
    }
  }, [monthlyDetails]);

  // ✅ دالة الحفظ اليدوي
  const handleManualSave = () => {
    localStorage.setItem('monthlyDetails', JSON.stringify(monthlyDetails));
    setSaveMessage('✅ تم الحفظ بنجاح!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // ✅ دالة مسح الكل
  const handleClearAll = () => {
    localStorage.removeItem('monthlyDetails');
    const empty = months.reduce((acc, month) => {
      acc[month] = [];
      return acc;
    }, {});
    setMonthlyDetails(empty);
    setSaveMessage('🗑️ تم مسح كل البيانات!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // ✅ دالة التحديث لبيانات شهر واحد
  const updateMonthDetails = (month, newData) => {
    setMonthlyDetails({
      ...monthlyDetails,
      [month]: newData
    });
  };

  // ✅ دالة حساب النتائج الشهرية
  const calculateMonthlyResults = (details, entries) => {
    const totalOperations = details.reduce(
      (sum, d) => sum + (Number(d.operationsMonthly) || 0),
      0
    );

    const totalCapital = details.reduce(
      (sum, d) => sum + (Number(d.capital) || 0),
      0
    );

    const transferFees = totalOperations * 117;
    const floorFees = totalOperations * 250;

    let subscriptions = 0;
    for (const entry of entries) {
      const count = details.filter(
        (d) => Number(d.financingRate) === Number(entry.financingRate)
      ).length;
      subscriptions += count * (entry.monthlySubscription || 0);
    }

    const netProfit = subscriptions + transferFees + floorFees;

    return {
      totalOperations,
      totalCapital,
      transferFees,
      floorFees,
      subscriptions,
      netProfit
    };
  };

  // ✅ حساب النتائج للشهر الحالي المختار
  const results = calculateMonthlyResults(
    monthlyDetails[selectedMonth],
    entries
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          أهلا بكم في نظام تمويل التجار لدى معارض السيارات
        </h1>
      </div>

      {/* ✅ أزرار الحفظ والمسح */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleManualSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          💾 حفظ البيانات
        </button>
        <button
          onClick={handleClearAll}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          🗑️ مسح كل البيانات
        </button>
      </div>

      {/* ✅ إشعار الحفظ */}
      {saveMessage && (
        <div className="text-center mb-4 text-blue-800 font-bold">
          {saveMessage}
        </div>
      )}

      {/* ✅ أزرار اختيار الشهر */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-3 py-1 rounded border ${
              selectedMonth === month
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border-blue-700'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* ✅ جدول التمويل للشهر المختار */}
      <BasicTable entries={entries} details={monthlyDetails[selectedMonth]} />

      {/* ✅ جدول النتائج الشهرية */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-800">
          النتائج الشهرية - {selectedMonth}
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border mb-3">
            <tbody>
              <tr>
                <td className="border p-2">إجمالي الاشتراكات</td>
                <td className="border p-2 text-center">{results.subscriptions.toLocaleString()} ريال</td>
              </tr>
              <tr>
                <td className="border p-2">رسوم نقل الملكية</td>
                <td className="border p-2 text-center">{results.transferFees.toLocaleString()} ريال</td>
              </tr>
              <tr>
                <td className="border p-2">رسوم الأرضيات</td>
                <td className="border p-2 text-center">{results.floorFees.toLocaleString()} ريال</td>
              </tr>
              <tr>
                <td className="border p-2">عدد العمليات الشهرية</td>
                <td className="border p-2 text-center">{results.totalOperations.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="border p-2">مجموع رأس المال</td>
                <td className="border p-2 text-center">{results.totalCapital.toLocaleString()} ريال</td>
              </tr>
              <tr className="bg-blue-100 font-bold">
                <td className="border p-2">✅ صافي الربح الشهري</td>
                <td className="border p-2 text-center">{results.netProfit.toLocaleString()} ريال</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ جدول تفاصيل المشتركين لهذا الشهر */}
      <DetailsTable
        details={monthlyDetails[selectedMonth]}
        setDetails={(newData) => updateMonthDetails(selectedMonth, newData)}
        financingRates={entries.map((e) => e.financingRate)}
      />
    </div>
  );
}
