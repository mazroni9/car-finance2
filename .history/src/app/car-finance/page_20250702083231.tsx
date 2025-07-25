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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            ملخص التمويل
          </h1>
        </div>

        <div className="space-y-8">
          {/* ملخص مالي */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
          ) : (
            <FinanceSummary summary={summary} />
          )}

          {/* جدول التمويل */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              جدول قواعد التمويل
            </h2>
            <CarFinanceTable />
          </div>
        </div>
      </div>
    </div>
  );
}
