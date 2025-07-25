'use client';

import { useState, useEffect } from 'react';
import SettlementSummary from '@/components/settlements/SettlementSummary';
import SettlementTable from '@/components/settlements/SettlementTable';
import SettlementFilters from '@/components/settlements/SettlementFilters';
import SettlementDetails from '@/components/settlements/SettlementDetails';
import type { Settlement, SettlementFilters as SettlementFiltersType } from '@/types/settlement';

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SettlementFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettlements();
  }, [filters]);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // إضافة الفلاتر إلى URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/settlements?${params.toString()}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات التسويات');
      }
      const data = await response.json();
      setSettlements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SettlementFiltersType) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    fetchSettlements();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'car_sale':
        return '🚗';
      case 'commission':
        return '💰';
      case 'transfer_fee':
        return '💸';
      case 'refund':
        return '↩️';
      case 'platform_fee':
        return '🏢';
      case 'showroom_fee':
        return '🏬';
      default:
        return '📋';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                مراقبة عمليات التسويات المالية
              </h1>
              <p className="text-gray-600">
                تتبع وإدارة جميع عمليات التسويات المالية في المنصة
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                تحديث البيانات
              </button>
            </div>
          </div>
        </div>

        {/* ملخص التسويات */}
        <SettlementSummary />

        {/* الفلاتر */}
        {showFilters && (
          <div className="mb-6">
            <SettlementFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* جدول التسويات */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                قائمة التسويات
              </h2>
              <div className="text-sm text-gray-500">
                إجمالي التسويات: {settlements.length}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 text-lg mb-2">❌</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : settlements.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <p className="text-gray-600">لا توجد تسويات لعرضها</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      من محفظة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إلى محفظة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {settlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getTypeIcon(settlement.type)}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {settlement.type === 'car_sale' && 'بيع سيارة'}
                              {settlement.type === 'commission' && 'عمولة'}
                              {settlement.type === 'transfer_fee' && 'رسوم نقل'}
                              {settlement.type === 'refund' && 'استرداد'}
                              {settlement.type === 'platform_fee' && 'رسوم المنصة'}
                              {settlement.type === 'showroom_fee' && 'رسوم المعرض'}
                            </div>
                            {settlement.car_details && (
                              <div className="text-xs text-gray-500">
                                {settlement.car_details.make} {settlement.car_details.model} {settlement.car_details.year}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(settlement.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {settlement.from_wallet.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {settlement.to_wallet.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(settlement.status)}`}>
                          {settlement.status === 'completed' && 'مكتمل'}
                          {settlement.status === 'pending' && 'قيد الانتظار'}
                          {settlement.status === 'failed' && 'فشل'}
                          {settlement.status === 'cancelled' && 'ملغي'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(settlement.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          عرض التفاصيل
                        </button>
                        {settlement.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-900">
                            إكمال
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 