'use client';

import { useEffect, useState } from 'react';
import type { SettlementSummary } from '@/types/settlement';

export default function SettlementSummary() {
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settlements/summary');
      if (!response.ok) {
        throw new Error('فشل في جلب ملخص التسويات');
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">❌ {error}</p>
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* إجمالي التسويات */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">إجمالي التسويات</p>
            <p className="text-2xl font-bold">{summary.total_settlements}</p>
            <p className="text-blue-100 text-sm">{formatCurrency(summary.total_amount)}</p>
          </div>
          <div className="text-3xl">💰</div>
        </div>
      </div>

      {/* التسويات المكتملة */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">التسويات المكتملة</p>
            <p className="text-2xl font-bold">{summary.completed_amount > 0 ? '✅' : '0'}</p>
            <p className="text-green-100 text-sm">{formatCurrency(summary.completed_amount)}</p>
          </div>
          <div className="text-3xl">✅</div>
        </div>
      </div>

      {/* تسويات اليوم */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">تسويات اليوم</p>
            <p className="text-2xl font-bold">{summary.today_settlements}</p>
            <p className="text-purple-100 text-sm">{formatCurrency(summary.today_amount)}</p>
          </div>
          <div className="text-3xl">📅</div>
        </div>
      </div>

      {/* تسويات الشهر */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">تسويات الشهر</p>
            <p className="text-2xl font-bold">{summary.monthly_settlements}</p>
            <p className="text-orange-100 text-sm">{formatCurrency(summary.monthly_amount)}</p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>
    </div>
  );
} 