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
  total_down_payments: number;
  total_last_payments_per_year: number;
  total_annual_profit_before_costs: number;
}

export default function CarFinancePage() {
  const [summary, setSummary] = useState<FinancialSummary | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        console.log('Fetching financial summary...');
        const response = await fetch('/api/finance-summary');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received summary:', data);
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch summary');
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
          {error ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center text-red-500">
                <p className="text-lg">❌ خطأ في جلب البيانات</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : loading ? (
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
