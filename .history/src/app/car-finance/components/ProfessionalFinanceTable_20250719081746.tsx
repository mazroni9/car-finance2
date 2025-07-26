'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface FinanceData {
  id: string;
  profit_percent: number;
  duration_months: number;
  price_category: number;
  car_count: number;
  first_payment_percent: number;
  first_payment: number;
  last_payment: number;
  profit_after: number;
  installment_sale_price: number;
  monthly_installment: number;
  monthly_income: number;
  purchase_capacity: number;
  annual_income: number;
  tracking_cost: number;
  guarantor_cost: number;
  inspection_cost: number;
  salary_distribution: number;
  rent_distribution: number;
}

interface ProfessionalFinanceTableProps {
  data: FinanceData[];
  onDataChange: (data: FinanceData[]) => void;
}

export default function ProfessionalFinanceTable({ data, onDataChange }: ProfessionalFinanceTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<FinanceData | null>(null);

  const handleEdit = (row: FinanceData) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const handleSave = () => {
    if (editData) {
      const updatedData = data.map(item => 
        item.id === editData.id ? editData : item
      );
      onDataChange(updatedData);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
      const updatedData = data.filter(item => item.id !== id);
      onDataChange(updatedData);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString('ar-SA');
  const formatPercent = (num: number) => `${num}%`;

  const groupedData = data.reduce((acc, item) => {
    const key = `${item.profit_percent}-${item.duration_months}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, FinanceData[]>);

  const renderCell = (item: FinanceData, field: keyof FinanceData) => {
    if (editingId === item.id && editData) {
      return (
        <input
          type="number"
          value={editData[field] as number}
          onChange={(e) => setEditData({
            ...editData,
            [field]: Number(e.target.value)
          })}
          className="w-full px-2 py-1 border rounded text-center"
        />
      );
    }

    const value = item[field];
    if (typeof value === 'number') {
      if (field.includes('percent')) {
        return formatPercent(value);
      }
      return formatNumber(value);
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([key, items]) => {
        const [profitPercent, durationMonths] = key.split('-').map(Number);
        return (
          <div key={key} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <h3 className="text-xl font-bold">
                نسبة الربح: {profitPercent}% - مدة التمويل: {durationMonths} شهر
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الفئة السعرية</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">عدد السيارات</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">نسبة الدفعة الأولى</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">الدفعة الأولى</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">دفعة أخيرة</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">الربح بعد</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">سعر البيع بالتقسيط</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">القسط الشهري</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">الدخل الشهري</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">كم نقدر نشتري</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">الدخل السنوي</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تكلفة التتبع</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تكلفة عقد ضامن</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تكلفة الفحص الفني</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">توزيع الراتب</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">توزيع الإيجار</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-right text-sm">{renderCell(item, 'price_category')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'car_count')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'first_payment_percent')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'first_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'last_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'profit_after')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'installment_sale_price')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'monthly_installment')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'monthly_income')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'purchase_capacity')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'annual_income')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'tracking_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'guarantor_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'inspection_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'salary_distribution')}</td>
                      <td className="px-4 py-3 text-center text-sm">{renderCell(item, 'rent_distribution')}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {editingId === item.id ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={handleSave}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
} 