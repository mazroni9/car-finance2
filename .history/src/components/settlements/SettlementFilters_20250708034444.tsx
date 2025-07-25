'use client';

import { useState, useEffect } from 'react';
import type { SettlementFilters } from '@/types/settlement';

interface SettlementFiltersProps {
  filters: SettlementFilters;
  onFilterChange: (filters: SettlementFilters) => void;
}

export default function SettlementFilters({ filters, onFilterChange }: SettlementFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SettlementFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key: keyof SettlementFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: SettlementFilters = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">فلاتر البحث</h3>
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تطبيق الفلاتر
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* نوع التسوية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع التسوية
          </label>
          <select
            value={localFilters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الأنواع</option>
            <option value="car_sale">بيع سيارة</option>
            <option value="commission">عمولة</option>
            <option value="transfer_fee">رسوم نقل</option>
            <option value="refund">استرداد</option>
            <option value="platform_fee">رسوم المنصة</option>
            <option value="showroom_fee">رسوم المعرض</option>
          </select>
        </div>

        {/* حالة التسوية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة التسوية
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="completed">مكتمل</option>
            <option value="failed">فشل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        {/* تاريخ البداية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            من تاريخ
          </label>
          <input
            type="date"
            value={localFilters.date_from || ''}
            onChange={(e) => handleInputChange('date_from', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* تاريخ النهاية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            إلى تاريخ
          </label>
          <input
            type="date"
            value={localFilters.date_to || ''}
            onChange={(e) => handleInputChange('date_to', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* الحد الأدنى للمبلغ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى للمبلغ
          </label>
          <input
            type="number"
            placeholder="0"
            value={localFilters.min_amount || ''}
            onChange={(e) => handleInputChange('min_amount', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* الحد الأقصى للمبلغ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأقصى للمبلغ
          </label>
          <input
            type="number"
            placeholder="1000000"
            value={localFilters.max_amount || ''}
            onChange={(e) => handleInputChange('max_amount', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* معرف المحفظة */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            معرف المحفظة (من أو إلى)
          </label>
          <input
            type="text"
            placeholder="أدخل معرف المحفظة"
            value={localFilters.wallet_id || ''}
            onChange={(e) => handleInputChange('wallet_id', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
} 