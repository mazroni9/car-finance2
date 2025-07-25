"use client";
import { useState } from 'react';
import InputTable from './InputTable';
import ResultsTable from './ResultsTable';

export default function TraderFinancePage() {
  const [entries, setEntries] = useState([
    {
      financingRate: 25,
      monthlySubscription: 500
    },
    {
      financingRate: 50,
      monthlySubscription: 1000
    },
    {
      financingRate: 75,
      monthlySubscription: 1500
    },
    {
      financingRate: 100,
      monthlySubscription: 2000
    }
  ]);

  const [details, setDetails] = useState([]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* العنوان الكبير الأزرق في الأعلى */}
      <div className="flex items-center justify-center py-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          أهلا بكم في نظام تمويل التجار لدى معارض السيارات
        </h1>
      </div>

      {/* ✅ القسم: جدول التمويل */}
      <ResultsTable entries={entries} details={details} />

      {/* ✅ القسم: جدول تفاصيل المشتركين */}
      <InputTable details={details} setDetails={setDetails} financingRate={entries[0]?.financingRate || 25} />
    </div>
  );
}
