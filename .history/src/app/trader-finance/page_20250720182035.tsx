"use client";
import { useState, useEffect } from 'react';
import BasicTable from './basic-table';
import DetailsTable from './details-table';
import SummarySection from './SummarySection';


type Detail = {
  id: number;
  capital: number;
  operationsMonthly: number;
  financingRate: number;
};

type MonthlyDetails = Record<string, Detail[]>;

export default function Page() {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const [selectedMonth, setSelectedMonth] = useState('يناير');

  const [entries] = useState([
    { financingRate: 25, monthlySubscription: 500 },
    { financingRate: 50, monthlySubscription: 800 },
    { financingRate: 75, monthlySubscription: 1200 },
    { financingRate: 100, monthlySubscription: 1500 }
  ]);

  const initialMonthlyDetails: MonthlyDetails = months.reduce((acc, month) => {
    acc[month] = [];
    return acc;
  }, {} as MonthlyDetails);

  const [monthlyDetails, setMonthlyDetails] = useState<MonthlyDetails>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyDetails');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return initialMonthlyDetails;
  });

  // حفظ تلقائي عند كل تعديل
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyDetails', JSON.stringify(monthlyDetails));
    }
  }, [monthlyDetails]);

  const updateMonthDetails = (month: string, newData: Detail[]) => {
    setMonthlyDetails({
      ...monthlyDetails,
      [month]: newData
    });
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="text-center py-4 flex items-center justify-between print:block print:w-full print:justify-center">
        <h1 className="text-3xl font-bold text-blue-700">
          أهلا بكم في نظام تمويل التجار لدى معارض السيارات
        </h1>
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = "/DASM-e-بتش-ديك.pdf";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="ml-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow text-lg print:hidden"
        >
          🖨️ طباعة PDF
        </button>
      </div>

      <div className="print:hidden">
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

        {/* جدول التمويل للشهر المختار */}
        <BasicTable entries={entries} details={monthlyDetails[selectedMonth]} />

        <div className="text-center text-green-600 font-bold mt-2">
          ✅ يتم الحفظ تلقائيًا عند أي تعديل
        </div>
      </div>

      {/* جدول النتائج السنوية + الشهرية */}
      <SummarySection allMonthlyDetails={monthlyDetails} entries={entries} />

      {/* جدول تفاصيل المشتركين لهذا الشهر فقط */}
      <div className="mt-8 print:hidden">
        <DetailsTable
          details={monthlyDetails[selectedMonth]}
          setDetails={(newData) => updateMonthDetails(selectedMonth, newData)}
          financingRates={entries.map((e) => e.financingRate)}
        />
      </div>
    </main>
  );
}