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

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/financial-summary');
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching financial summary:', error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <CarFinanceTable />
      <FinanceSummary summary={summary} />
    </div>
  );
}
