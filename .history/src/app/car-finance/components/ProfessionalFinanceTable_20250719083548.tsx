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

  const getCellStyle = (field: keyof FinanceData, value: number) => {
    if (field.includes('percent')) {
      return 'text-blue-600 font-semibold'; // أزرق للنسب المئوية
    }
    if (field.includes('income') || field.includes('profit')) {
      return 'text-green-600 font-semibold'; // أخضر للدخل والربح
    }
    if (field.includes('cost') || field.includes('payment')) {
      return 'text-orange-600 font-semibold'; // برتقالي للتكاليف والمدفوعات
    }
    if (field.includes('price') || field.includes('sale')) {
      return 'text-purple-600 font-semibold'; // بنفسجي للأسعار
    }
    if (field.includes('count') || field.includes('quantity')) {
      return 'text-indigo-600 font-semibold'; // نيلي للأعداد
    }
    return 'text-gray-700 font-medium'; // رمادي للباقي
  };

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
          className="w-full px-2 py-1 border rounded text-center bg-yellow-50 focus:bg-white"
          title={`تعديل ${field}`}
        />
      );
    }

    const value = item[field];
    if (typeof value === 'number') {
      const style = getCellStyle(field, value);
      if (field.includes('percent')) {
        return <span className={style}>{formatPercent(value)}</span>;
      }
      return <span className={style}>{formatNumber(value)}</span>;
    }
    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([key, items]) => {
        const [profitPercent, durationMonths] = key.split('-').map(Number);
        return (
          <div key={key} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <h3 className="text-xl font-bold">
                نسبة الربح: {profitPercent}% - مدة التمويل: {durationMonths} شهر
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-800 border-b border-gray-200">الفئة السعرية</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">عدد السيارات</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">نسبة الدفعة الأولى</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">الدفعة الأولى</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">دفعة أخيرة</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">الربح بعد</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">سعر البيع بالتقسيط</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">القسط الشهري</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">الدخل الشهري</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">كم نقدر نشتري</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">الدخل السنوي</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">تكلفة التتبع</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">تكلفة عقد ضامن</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">تكلفة الفحص الفني</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">توزيع الراتب</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">توزيع الإيجار</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 border-b border-gray-200">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-4 py-3 text-right text-sm border-r border-gray-100">{renderCell(item, 'price_category')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'car_count')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'first_payment_percent')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'first_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'last_payment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'profit_after')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'installment_sale_price')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'monthly_installment')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'monthly_income')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'purchase_capacity')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'annual_income')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'tracking_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'guarantor_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'inspection_cost')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'salary_distribution')}</td>
                      <td className="px-4 py-3 text-center text-sm border-r border-gray-100">{renderCell(item, 'rent_distribution')}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {editingId === item.id ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={handleSave}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
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