'use client';

import { useEffect, useState } from 'react';
import CarFinanceTable from './components/CarFinanceTable';
import FinanceSummary from './components/FinanceSummary';

interface FinancialSummary {
  total_monthly_installments: number;
  total_annual_income: number;
  total_purchase_cost: number;
  total_profit_full_period: number;
  avg_roi_full_period: number;
  avg_roi_annual: number;
}

export default function CarFinancePage() {
  const [summary, setSummary] = useState<FinancialSummary | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/financial-summary');
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching financial summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-8">ملخص التمويل</h1>
      <CarFinanceTable />
      {loading ? (
        <div className="text-center py-8 text-gray-500">جاري تحميل البيانات...</div>
      ) : (
        <FinanceSummary summary={summary} />
      )}
    </div>
  );
}
