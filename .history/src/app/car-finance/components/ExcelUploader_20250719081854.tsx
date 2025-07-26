'use client';

import React, { useRef } from 'react';
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

interface ExcelUploaderProps {
  onDataImport: (data: FinanceData[]) => void;
}

export default function ExcelUploader({ onDataImport }: ExcelUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const importedData: FinanceData[] = [];
        let idCounter = 1;

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // استخراج نسبة الربح والمدة من اسم الشيت
          const sheetInfo = sheetName.match(/(\d+)%.*?(\d+)/);
          const profitPercent = sheetInfo ? parseInt(sheetInfo[1]) : 30;
          const durationMonths = sheetInfo ? parseInt(sheetInfo[2]) : 12;

          // تخطي الصف الأول (العناوين)
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row.length > 0 && row[0]) {
              const newRow: FinanceData = {
                id: `row_${idCounter++}`,
                profit_percent: profitPercent,
                duration_months: durationMonths,
                price_category: row[0] || 0,
                car_count: row[1] || 0,
                first_payment_percent: row[2] || 0,
                first_payment: row[3] || 0,
                last_payment: row[4] || 0,
                profit_after: row[5] || 0,
                installment_sale_price: row[6] || 0,
                monthly_installment: row[7] || 0,
                monthly_income: row[8] || 0,
                purchase_capacity: row[9] || 0,
                annual_income: row[10] || 0,
                tracking_cost: row[11] || 0,
                guarantor_cost: row[12] || 0,
                inspection_cost: row[13] || 0,
                salary_distribution: row[14] || 0,
                rent_distribution: row[15] || 0,
              };
              importedData.push(newRow);
            }
          }
        });

        onDataImport(importedData);
        alert(`تم استيراد ${importedData.length} صف بنجاح!`);
      } catch (error) {
        console.error('خطأ في قراءة الملف:', error);
        alert('حدث خطأ في قراءة الملف. تأكد من أن الملف بتنسيق Excel صحيح.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = (data: FinanceData[]) => {
    const workbook = XLSX.utils.book_new();
    
    // تجميع البيانات حسب نسبة الربح والمدة
    const groupedData = data.reduce((acc, item) => {
      const key = `${item.profit_percent}%-${item.duration_months}شهر`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, FinanceData[]>);

    Object.entries(groupedData).forEach(([sheetName, items]) => {
      const worksheetData = [
        [
          'الفئة السعرية', 'عدد السيارات', 'نسبة الدفعة الأولى', 'الدفعة الأولى',
          'دفعة أخيرة', 'الربح بعد', 'سعر البيع بالتقسيط', 'القسط الشهري',
          'الدخل الشهري', 'كم نقدر نشتري', 'الدخل السنوي', 'تكلفة التتبع',
          'تكلفة عقد ضامن', 'تكلفة الفحص الفني', 'توزيع الراتب', 'توزيع الإيجار'
        ],
        ...items.map(item => [
          item.price_category, item.car_count, item.first_payment_percent,
          item.first_payment, item.last_payment, item.profit_after,
          item.installment_sale_price, item.monthly_installment, item.monthly_income,
          item.purchase_capacity, item.annual_income, item.tracking_cost,
          item.guarantor_cost, item.inspection_cost, item.salary_distribution,
          item.rent_distribution
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, 'finance_data.xlsx');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">استيراد وتصدير البيانات</h3>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
            title="اختر ملف Excel أو CSV"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
          >
            📁 استيراد من Excel/CSV
          </button>
        </div>

        <button
          onClick={() => handleExport(data)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
        >
          📊 تصدير إلى Excel
        </button>

        <div className="text-sm text-gray-600">
          <p>• يدعم ملفات Excel (.xlsx, .xls) و CSV</p>
          <p>• تأكد من أن الأعمدة في الملف مطابقة للجدول</p>
        </div>
      </div>
    </div>
  );
} 