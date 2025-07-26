import SummarySection from './SummarySection';
import { useEffect, useState } from 'react';

// نسخة مبسطة للطباعة فقط
export default function PrintPage() {
  const [monthlyDetails, setMonthlyDetails] = useState({});
  const [entries, setEntries] = useState([
    { financingRate: 25, monthlySubscription: 500 },
    { financingRate: 50, monthlySubscription: 800 },
    { financingRate: 75, monthlySubscription: 1200 },
    { financingRate: 100, monthlySubscription: 1500 }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyDetails');
      if (stored) {
        setMonthlyDetails(JSON.parse(stored));
      }
      // تنفيذ الطباعة تلقائياً عند فتح الصفحة
      setTimeout(() => window.print(), 500);
    }
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 px-2 print:p-0" style={{ zoom: 0.85 }}>
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 print:mb-4">نتائج تمويل التجار السنوية والشهرية</h1>
      <div className="max-w-5xl mx-auto">
        <SummarySection allMonthlyDetails={monthlyDetails} entries={entries} />
      </div>
      <style>{`
        @media print {
          body, html { background: #fff !important; }
          .print\:p-0 { padding: 0 !important; }
          .max-w-5xl { max-width: 100% !important; }
          .text-3xl { font-size: 2.2rem !important; }
          table { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
} 