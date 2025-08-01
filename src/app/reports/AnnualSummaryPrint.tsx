import { useEffect } from 'react';
import AnnualSummaryTable from '../car-leasing/AnnualSummaryTable';

export default function AnnualSummaryPrint() {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 px-2 print:p-0" style={{ zoom: 0.95 }}>
      <h1 className="text-3xl font-bold text-center text-yellow-700 mb-8 print:mb-4">الملخص السنوي للإيجار</h1>
      <div className="max-w-4xl mx-auto">
        <AnnualSummaryTable rows={[]} />
      </div>
      <div className="text-center py-2">
        <strong>معادلة العائد على الاستثمار السنوي (ROI):</strong>
        <span className="text-blue-600 font-mono">((مجموع الربح الأساسي + مجموع الرسوم الإدارية) ÷ تكلفة الشراء) × 100</span>
        <br />
        <strong>معادلة ROI عند استكمال العقد:</strong>
        <span className="text-green-600 font-mono">((مجموع الربح الأساسي + مجموع الربح الممتد + مجموع الرسوم الإدارية) ÷ تكلفة الشراء) × 100</span>
      </div>
      <style>{`
        @media print {
          body, html { background: #fff !important; }
          .print\:p-0 { padding: 0 !important; }
          .max-w-4xl { max-width: 100% !important; }
          .text-3xl { font-size: 2.2rem !important; }
          table { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
} 