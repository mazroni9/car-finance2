"use client";
import { useState, useEffect } from 'react';
import BasicTable from './basic-table';
import DetailsTable from './details-table';
import SummarySection from './SummarySection';

type Detail = {
  id: number;
  capital: number;
  operationsMonthly: number;
  financingRate?: number;
};

type MonthlyDetails = Record<string, Detail[]>;

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

  const initialMonthlyDetails: MonthlyDetails = months.reduce((acc, month) => {
    acc[month] = [];
    return acc;
  }, {} as MonthlyDetails);

  const [monthlyDetails, setMonthlyDetails] = useState<MonthlyDetails>(initialMonthlyDetails);

  const [saveMessage, setSaveMessage] = useState('');

  // ✅ عند تشغيل الصفحة: تحميل البيانات من LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyDetails');
      if (stored) {
        setMonthlyDetails(JSON.parse(stored));
      }
    }
  }, []);

  // ✅ حفظ تلقائي عند كل تعديل
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyDetails', JSON.stringify(monthlyDetails));
      setSaveMessage('✅ تم الحفظ التلقائي');
      const timer = setTimeout(() => setSaveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [monthlyDetails]);

  // ✅ مسح كل البيانات
  const handleClearAll = () => {
    localStorage.removeItem('monthlyDetails');
    const empty = months.reduce((acc, month) => {
      acc[month] = [];
      return acc;
    }, {} as MonthlyDetails);
    setMonthlyDetails(empty);
    setSaveMessage('🗑️ تم مسح كل البيانات!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const updateMonthDetails = (month: string, newData: Detail[]) => {
    setMonthlyDetails({
      ...monthlyDetails,
      [month]: newData
    });
  };

  const handleManualSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyDetails', JSON.stringify(monthlyDetails));
      setSaveMessage('✅ تم الحفظ اليدوي');
      const timer = setTimeout(() => setSaveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          أهلا بكم في نظام تمويل التجار لدى معارض السيارات
        </h1>
      </div>

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

      {/* ✅ إشعار الحفظ التلقائي */}
      {saveMessage && (
        <div className="text-center mb-4 text-green-700 font-bold">
          {saveMessage}
        </div>
      )}

      {/* ✅ زر الحفظ فقط */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleManualSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          💾 حفظ البيانات
        </button>
      </div>

      {/* ✅ جدول التمويل للشهر المختار */}
      <BasicTable entries={entries} details={monthlyDetails[selectedMonth]} />

      {/* ✅ جدول النتائج السنوية + الشهرية */}
      <SummarySection allMonthlyDetails={monthlyDetails} entries={entries} />

      {/* ✅ جدول تفاصيل المشتركين لهذا الشهر فقط */}
      <DetailsTable
        details={monthlyDetails[selectedMonth]}
        setDetails={(newData) => updateMonthDetails(selectedMonth, newData)}
        financingRates={entries.map((e) => e.financingRate)}
      />
    </div>
  );
}
