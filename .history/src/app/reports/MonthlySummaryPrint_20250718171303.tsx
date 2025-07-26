import { useEffect } from 'react';
import MonthlySummaryTable from './MonthlySummaryTable';

export default function MonthlySummaryPrint() {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 px-2 print:p-0" style={{ zoom: 0.95 }}>
      <h1 className="text-3xl font-bold text-center text-yellow-700 mb-8 print:mb-4">ملخص الإيجار الشهري لكل شهر</h1>
      <div className="max-w-3xl mx-auto">
        <MonthlySummaryTable />
      </div>
      <style>{`
        @media print {
          body, html { background: #fff !important; }
          .print\:p-0 { padding: 0 !important; }
          .max-w-3xl { max-width: 100% !important; }
          .text-3xl { font-size: 2.2rem !important; }
          table { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
} 