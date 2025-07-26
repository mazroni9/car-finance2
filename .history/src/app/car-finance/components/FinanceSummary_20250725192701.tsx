'use client';

import React from 'react';
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';

interface FinancialSummary {
  total_monthly_installments: number;
  total_annual_income: number;
  total_down_payment: number;
  total_last_payment: number;
  total_service_fees: number;
  total_annual_profit_before_costs: number;
  total_profit_full_period: number;
  total_purchase_cost: number;
  avg_roi_full_period: number;
  avg_roi_annual: number;
  total_last_payment_all_contracts: number;
}

interface FinanceSummaryProps {
  summary: FinancialSummary | undefined;
}

export default function FinanceSummary({ summary }: FinanceSummaryProps) {
  if (!summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => Math.round(num).toLocaleString('en-US');
  const formatPercent = (num: number) => `${(num * 100).toFixed(1)}%`;

  const summaryItems = [
    {
      label: 'إجمالي الأقساط الشهرية',
      value: `SAR ${formatNumber(summary.total_monthly_installments)}`,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      icon: '💰'
    },
    {
      label: 'إجمالي رسوم الخدمة',
      value: `SAR ${formatNumber(summary.total_service_fees)}`,
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      icon: '💸'
    },
    {
      label: 'إجمالي الدفعات الأخيرة السنوية',
      value: `SAR ${formatNumber(summary.total_last_payment)}`,
      color: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-700 dark:text-cyan-300',
      icon: '💵'
    },
    {
      label: 'إجمالي الدفعات الأخيرة لكل العقود',
      value: `SAR ${formatNumber(summary.total_last_payment_all_contracts)}`,
      color: 'bg-lime-50 dark:bg-lime-900/20',
      textColor: 'text-lime-700 dark:text-lime-300',
      icon: '🟢'
    },
    {
      label: 'إجمالي تكلفة الشراء السنوية',
      value: `SAR ${formatNumber(summary.total_purchase_cost)}`,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      icon: '🛒'
    },
    {
      label: 'إجمالي الدخل السنوي',
      value: `SAR ${formatNumber(summary.total_annual_income)}`,
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      icon: '📈'
    },
    {
      label: 'إجمالي الربح الكامل',
      value: `SAR ${formatNumber(summary.total_profit_full_period)}`,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      icon: '💎'
    },
    {
      label: 'إجمالي الربح السنوي قبل التكاليف',
      value: `SAR ${formatNumber(summary.total_annual_profit_before_costs)}`,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      icon: '💹'
    },
    {
      label: 'متوسط ROI كامل الفترة',
      value: formatPercent(summary.avg_roi_full_period),
      color: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-700 dark:text-pink-300',
      icon: '📊'
    },
    {
      label: 'متوسط ROI السنوي',
      value: formatPercent(summary.avg_roi_annual),
      color: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      icon: '📅'
    }
  ];

  // دالة تصدير الملخص المالي إلى PDF
  const handleExportSummaryToPDF = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    doc.setFont('Arial');
    doc.setFontSize(18);
    doc.text('الملخص المالي - منصة تمويل السيارات', 300, 50, { align: 'center' });
    doc.setFontSize(12);
    let y = 100;
    const summaryRows = [
      ['إجمالي الأقساط الشهرية', summary.total_monthly_installments],
      ['إجمالي رسوم الخدمة', summary.total_service_fees],
      ['إجمالي الدفعات الأخيرة السنوية', summary.total_last_payment],
      ['إجمالي الدفعات الأخيرة لكل العقود', summary.total_last_payment_all_contracts],
      ['إجمالي تكلفة الشراء السنوية', summary.total_purchase_cost],
      ['إجمالي الدخل السنوي', summary.total_annual_income],
      ['إجمالي الربح الكامل', summary.total_profit_full_period],
      ['إجمالي الربح السنوي قبل التكاليف', summary.total_annual_profit_before_costs],
      ['متوسط ROI كامل الفترة', (summary.avg_roi_full_period * 100).toFixed(1) + '%'],
      ['متوسط ROI السنوي', (summary.avg_roi_annual * 100).toFixed(1) + '%'],
    ];
    summaryRows.forEach(([label, value]) => {
      doc.setFontSize(13);
      doc.setTextColor('#333');
      doc.text(`${label}:`, 80, y);
      doc.setFontSize(14);
      doc.setTextColor('#007b55');
      doc.text(typeof value === 'number' ? value.toLocaleString() : value, 350, y);
      y += 32;
    });
    doc.save('الملخص_المالي.pdf');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        الملخص المالي
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-lg p-6 transition-all hover:shadow-lg`}
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${item.textColor} mb-2`}>
                  {item.label}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* بطاقة زر تصدير PDF بنفس نسق البطاقات */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg">
          <button
            onClick={handleExportSummaryToPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-colors text-base"
          >
            تصدير الملخص المالي إلى PDF
          </button>
        </div>
      </div>
    </div>
  );
}
