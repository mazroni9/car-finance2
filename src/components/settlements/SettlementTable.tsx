'use client';

import { useState } from 'react';
import type { Settlement } from '@/types/settlement';

interface SettlementTableProps {
  settlements: Settlement[];
  onSettlementAction?: (settlementId: string, action: 'complete' | 'cancel' | 'view') => void;
}

export default function SettlementTable({ settlements, onSettlementAction }: SettlementTableProps) {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

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

  const handleAction = (settlementId: string, action: 'complete' | 'cancel' | 'view') => {
    if (onSettlementAction) {
      onSettlementAction(settlementId, action);
    }
  };

  return (
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
                      {getTypeLabel(settlement.type)}
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
                  {getStatusLabel(settlement.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(settlement.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => handleAction(settlement.id, 'view')}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  عرض التفاصيل
                </button>
                {settlement.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleAction(settlement.id, 'complete')}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      إكمال
                    </button>
                    <button 
                      onClick={() => handleAction(settlement.id, 'cancel')}
                      className="text-red-600 hover:text-red-900"
                    >
                      إلغاء
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 