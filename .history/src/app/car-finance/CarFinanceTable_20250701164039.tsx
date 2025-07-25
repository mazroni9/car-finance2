'use client';

interface InstallmentRule {
  id: number;
  price_category: number;
  duration_months: number;
  down_payment_percent: number;
  last_payment_percent: number;
  quantity: number;
  profit_value: number;
  monthly_income: number;
  profit_target_percent: number;
}

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

  // ✅ المجاميع
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        📋 قائمة بيانات التمويل
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow mb-6">
        <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b">
            <tr className="text-gray-900 dark:text-gray-100 text-center">
              <th className="px-4 py-2 border">الفئة السعرية (ريال)</th>
              <th className="px-4 py-2 border">مدة التمويل (شهر)</th>
              <th className="px-4 py-2 border">عدد السيارات</th>
              <th className="px-4 py-2 border">دفعة أولى (ريال)</th>
              <th className="px-4 py-2 border">دفعة أخيرة (ريال)</th>
              <th className="px-4 py-2 border">سعر البيع بالتقسيط (ريال)</th>
              <th className="px-4 py-2 border">القسط الشهري (ريال)</th>
              <th className="px-4 py-2 border">إجمالي الأقساط الشهرية (ريال)</th>
              <th className="px-4 py-2 border">الربح (للسيارة) (ريال)</th>
              <th className="px-4 py-2 border">إجمالي الربح (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const financedAmount = item.price_category - (item.price_category * item.down_payment_percent);
              const profitPerCar = financedAmount * item.profit_target_percent;
              const salePrice = financedAmount + profitPerCar;
              const monthlyInstallment = (salePrice - (item.price_category * item.last_payment_percent)) / item.duration_months;
              const totalMonthlyIncome = monthlyInstallment * item.quantity;
              const totalProfit = profitPerCar * item.quantity;

              return (
                <tr key={item.id} className="text-center border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border">{item.price_category.toLocaleString()}</td>
                  <td className="px-4 py-2 border">{item.duration_months}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">
                    {(item.down_payment_percent * 100).toFixed(0)}% ({(item.price_category * item.down_payment_percent).toLocaleString()})
                  </td>
                  <td className="px-4 py-2 border">
                    {(item.last_payment_percent * 100).toFixed(0)}% ({(item.price_category * item.last_payment_percent).toLocaleString()})
                  </td>
                  <td className="px-4 py-2 border">{salePrice.toLocaleString()}</td>
                  <td className="px-4 py-2 border">{monthlyInstallment.toFixed(0)}</td>
                  <td className="px-4 py-2 border">{totalMonthlyIncome.toFixed(0)}</td>
                  <td className="px-4 py-2 border">{profitPerCar.toLocaleString()}</td>
                  <td className="px-4 py-2 border">{totalProfit.toLocaleString()}</td>
                </tr>
              );
            })}

            {/* ✅ صفوف المجاميع في التذييل */}
            <tr className="border-t font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>إجمالي الأقساط الشهرية:</td>
              <td className="px-4 py-2 border text-center">{totalMonthlySum.toLocaleString()}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>إجمالي ربح عمليات التقسيط لكامل الفترة:</td>
              <td className="px-4 py-2 border text-center">{totalProfitSum.toLocaleString()}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>إجمالي الربح السنوي قبل خصم التكاليف:</td>
              <td className="px-4 py-2 border text-center">{totalAnnualProfit.toLocaleString()}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>إجمالي الدخل السنوي:</td>
              <td className="px-4 py-2 border text-center">{totalAnnualIncome.toLocaleString()}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>إجمالي تكلفة شراء السيارات:</td>
              <td className="px-4 py-2 border text-center">{totalPurchaseCost.toLocaleString()}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>العائد على الاستثمار (ROI) لكامل الفترة:</td>
              <td className="px-4 py-2 border text-center">{roiTotal.toFixed(2)}%</td>
            </tr>

            <tr className="border-b font-bold text-gray-800 dark:text-gray-100">
              <td className="px-4 py-2 border text-end" colSpan={9}>العائد على الاستثمار (ROI) السنوي:</td>
              <td className="px-4 py-2 border text-center">{roiAnnual.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 