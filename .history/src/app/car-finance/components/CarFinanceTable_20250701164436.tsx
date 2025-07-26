'use client';

import { InstallmentRule } from '../types';

interface CarFinanceTableProps {
  rows: InstallmentRule[];
}

export default function CarFinanceTable({ rows }: CarFinanceTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        لا توجد بيانات محفوظة حتى الآن.
      </p>
    );
  }

  const totalMonthlySum = rows.reduce((sum, item) => sum + item.monthly_income, 0);
  const totalProfitSum = rows.reduce(
    (sum, item) =>
      sum +
      ((item.price_category - (item.price_category * item.down_payment_percent)) *
        item.profit_target_percent *
        item.quantity),
    0
  );
  const totalAnnualProfit = rows.reduce(
    (sum, item) =>
      sum +
      (((item.price_category - (item.price_category * item.down_payment_percent)) *
        item.profit_target_percent *
        item.quantity) *
        (12 / item.duration_months)),
    0
  );
  const totalAnnualIncome = totalMonthlySum * 12;
  const totalPurchaseCost = rows.reduce(
    (sum, item) => sum + (item.price_category * item.quantity),
    0
  );

  const roiTotal = totalPurchaseCost > 0 ? (totalProfitSum / totalPurchaseCost) * 100 : 0;
  const roiAnnual = totalPurchaseCost > 0 ? (totalAnnualProfit / totalPurchaseCost) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        📋 قائمة بيانات التمويل
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="text-gray-800 dark:text-white text-center">
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">الفئة السعرية (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">مدة التمويل (شهر)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">عدد السيارات</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">دفعة أولى (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">دفعة أخيرة (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">سعر البيع بالتقسيط (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">القسط الشهري (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">إجمالي الأقساط الشهرية (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">الربح (للسيارة) (ريال)</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">إجمالي الربح (ريال)</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-100">
            {rows.map((item) => {
              const financedAmount = item.price_category - (item.price_category * item.down_payment_percent);
              const profitPerCar = financedAmount * item.profit_target_percent;
              const salePrice = financedAmount + profitPerCar;
              const monthlyInstallment = (salePrice - (item.price_category * item.last_payment_percent)) / item.duration_months;
              const totalMonthlyIncome = monthlyInstallment * item.quantity;
              const totalProfit = profitPerCar * item.quantity;

              return (
                <tr key={item.id} className="text-center border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{item.price_category.toLocaleString()}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{item.duration_months}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{item.quantity}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    {(item.down_payment_percent * 100).toFixed(0)}% ({(item.price_category * item.down_payment_percent).toLocaleString()})
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    {(item.last_payment_percent * 100).toFixed(0)}% ({(item.price_category * item.last_payment_percent).toLocaleString()})
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{salePrice.toLocaleString()}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{monthlyInstallment.toFixed(0)}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{totalMonthlyIncome.toFixed(0)}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{profitPerCar.toLocaleString()}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{totalProfit.toLocaleString()}</td>
                </tr>
              );
            })}

            <tr className="border-t border-gray-300 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>إجمالي الأقساط الشهرية:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{totalMonthlySum.toLocaleString()}</td>
            </tr>

            <tr className="font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>إجمالي ربح عمليات التقسيط لكامل الفترة:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{totalProfitSum.toLocaleString()}</td>
            </tr>

            <tr className="font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>إجمالي الربح السنوي قبل خصم التكاليف:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{totalAnnualProfit.toLocaleString()}</td>
            </tr>

            <tr className="font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>إجمالي الدخل السنوي:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{totalAnnualIncome.toLocaleString()}</td>
            </tr>

            <tr className="font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>إجمالي تكلفة شراء السيارات:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{totalPurchaseCost.toLocaleString()}</td>
            </tr>

            <tr className="font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>العائد على الاستثمار (ROI) لكامل الفترة:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{roiTotal.toFixed(2)}%</td>
            </tr>

            <tr className="border-b border-gray-300 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-end" colSpan={9}>العائد على الاستثمار (ROI) السنوي:</td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">{roiAnnual.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 