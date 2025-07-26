'use client';

import { useState, useEffect } from 'react';
import type { Settlement } from '@/types/settlement';

interface SettlementDetailsProps {
  settlementId: string;
  onClose: () => void;
  onAction: (action: 'complete' | 'cancel') => void;
}

export default function SettlementDetails({ settlementId, onClose, onAction }: SettlementDetailsProps) {
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSettlementDetails();
  }, [settlementId]);

  const fetchSettlementDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settlements/${settlementId}`);
      if (!response.ok) {
        throw new Error('فشل في جلب تفاصيل التسوية');
      }
      const data = await response.json();
      setSettlement(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'complete' | 'cancel') => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/settlements/${settlementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('فشل في تنفيذ الإجراء');
      }

      const result = await response.json();
      if (result.success) {
        onAction(action);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setActionLoading(false);
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'car_sale':
        return 'بيع سيارة';
      case 'commission':
        return 'عمولة';
      case 'transfer_fee':
        return 'رسوم نقل';
      case 'refund':
        return 'استرداد';
      case 'platform_fee':
        return 'رسوم المنصة';
      case 'showroom_fee':
        return 'رسوم المعرض';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فشل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-red-500 text-center mb-4">❌</div>
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  if (!settlement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">تفاصيل التسوية</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                معرف التسوية
              </label>
              <p className="text-gray-900 font-mono text-sm">{settlement.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                النوع
              </label>
              <p className="text-gray-900">{getTypeLabel(settlement.type)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المبلغ
              </label>
              <p className="text-gray-900 font-bold">{formatCurrency(settlement.amount)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(settlement.status)}`}>
                {getStatusLabel(settlement.status)}
              </span>
            </div>
          </div>

          {/* المحافظ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                من محفظة
              </label>
              <p className="text-gray-900 font-mono text-sm">{settlement.from_wallet}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                إلى محفظة
              </label>
              <p className="text-gray-900 font-mono text-sm">{settlement.to_wallet}</p>
            </div>
          </div>

          {/* تفاصيل السيارة */}
          {settlement.car_details && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تفاصيل السيارة
              </label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900">
                  {settlement.car_details.make} {settlement.car_details.model} {settlement.car_details.year}
                </p>
                <p className="text-gray-600 text-sm">
                  السعر: {formatCurrency(settlement.car_details.price)}
                </p>
              </div>
            </div>
          )}

          {/* الوصف */}
          {settlement.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <p className="text-gray-900">{settlement.description}</p>
            </div>
          )}

          {/* التواريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الإنشاء
              </label>
              <p className="text-gray-900">{formatDate(settlement.created_at)}</p>
            </div>
            {settlement.completed_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الإكمال
                </label>
                <p className="text-gray-900">{formatDate(settlement.completed_at)}</p>
              </div>
            )}
          </div>

          {/* سبب الفشل */}
          {settlement.failed_reason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سبب الفشل
              </label>
              <p className="text-red-600">{settlement.failed_reason}</p>
            </div>
          )}

          {/* أزرار الإجراءات */}
          {settlement.status === 'pending' && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleAction('complete')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'جاري الإكمال...' : 'إكمال التسوية'}
              </button>
              <button
                onClick={() => handleAction('cancel')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'جاري الإلغاء...' : 'إلغاء التسوية'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 