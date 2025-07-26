"use client";
import { useState } from 'react';
import TraderFinancePage from './TraderFinancePage';
import BasicTable from './basic-table';

export default function Page() {
  const [showFull, setShowFull] = useState(false);

  const [entries] = useState([
    { financingRate: 25, monthlySubscription: 500 },
    { financingRate: 50, monthlySubscription: 1000 },
    { financingRate: 75, monthlySubscription: 1500 },
    { financingRate: 100, monthlySubscription: 2000 }
  ]);

  const [details] = useState([]);

  if (showFull) {
    return <TraderFinancePage />;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          أهلا بكم في نظام تمويل التجار لدى معارض السيارات
        </h1>
      </div>

      <BasicTable entries={entries} details={details} />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowFull(true)}
          className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800"
        >
          إضافة مشترك جديد
        </button>
      </div>
    </main>
  );
}
ذ