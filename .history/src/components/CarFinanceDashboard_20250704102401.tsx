'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Table, TableHeader, TableRow, TableCell, TableBody } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Car {
  id: number;
  priceCategory: number;
  quantity: number;
  downPaymentRate: number;
  installmentPlanId: number;
  monthlyIncome: number;
  annualIncome: number;
  inspectionCost: number;
  warrantyCost: number;
  trackingCost: number;
  purchaseCost: number;
  sellingPrice: number;
  installmentPlan: {
    months: number;
    profitRate: number;
  };
}

interface FinancialSummary {
  totalAnnualCost: number;
  totalAnnualIncome: number;
  salaryExpense: number;
  rentExpense: number;
  inspectionExpense: number;
  warrantyExpense: number;
  trackingExpense: number;
  operatingExpense: number;
  netProfit: number;
}

export default function CarFinanceDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('12');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [carsResponse, summaryResponse] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/finance/summary')
        ]);
        
        if (!carsResponse.ok || !summaryResponse.ok) {
          throw new Error('خطأ في جلب البيانات');
        }

        const [carsData, summaryData] = await Promise.all([
          carsResponse.json(),
          summaryResponse.json()
        ]);

        setCars(carsData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const carsByPlan = cars.reduce((acc, car) => {
    const months = car.installmentPlan.months;
    if (!acc[months]) acc[months] = [];
    acc[months].push(car);
    return acc;
  }, {} as Record<number, Car[]>);

  if (loading) return (
    <div className="glass-card p-8 text-center">
      <div className="text-xl">جاري تحميل البيانات...</div>
    </div>
  );

  if (error) return (
    <div className="glass-card p-8 text-center">
      <div className="error-box">{error}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="12">خطة 12 شهر</TabsTrigger>
              <TabsTrigger value="24">خطة 24 شهر</TabsTrigger>
              <TabsTrigger value="36">خطة 36 شهر</TabsTrigger>
            </TabsList>

            {[12, 24, 36].map((months) => (
              <TabsContent key={months} value={months.toString()}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>الفئة السعرية</TableCell>
                        <TableCell>عدد السيارات</TableCell>
                        <TableCell>نسبة الدفعة الأولى</TableCell>
                        <TableCell>القسط الشهري</TableCell>
                        <TableCell>الدخل الشهري</TableCell>
                        <TableCell>الدخل السنوي</TableCell>
                        <TableCell>التكاليف</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carsByPlan[months]?.map((car) => {
                        const monthlyPayment = Math.round((car.sellingPrice - (car.sellingPrice * car.downPaymentRate)) / months);
                        const totalCosts = car.inspectionCost + car.warrantyCost + car.trackingCost;
                        return (
                          <TableRow key={car.id}>
                            <TableCell>{car.priceCategory.toLocaleString()} ريال</TableCell>
                            <TableCell>{car.quantity}</TableCell>
                            <TableCell>{(car.downPaymentRate * 100)}%</TableCell>
                            <TableCell>{monthlyPayment.toLocaleString()} ريال</TableCell>
                            <TableCell>{car.monthlyIncome.toLocaleString()} ريال</TableCell>
                            <TableCell>{car.annualIncome.toLocaleString()} ريال</TableCell>
                            <TableCell>{totalCosts.toLocaleString()} ريال</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-xl font-bold mb-2">السيارات المتاحة</h3>
          <div className="stat-value">25</div>
          <div className="stat-label">سيارة</div>
        </div>
        
        <div className="stat-card">
          <h3 className="text-xl font-bold mb-2">إجمالي التمويل</h3>
          <div className="stat-value">2.4M</div>
          <div className="stat-label">ريال</div>
        </div>
        
        <div className="stat-card">
          <h3 className="text-xl font-bold mb-2">العقود النشطة</h3>
          <div className="stat-value">156</div>
          <div className="stat-label">عقد</div>
        </div>
      </div>

      {summary && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">ملخص التكاليف</h3>
                <div className="space-y-2">
                  <p>تكلفة الدخل السنوي: {summary.totalAnnualCost.toLocaleString()} ريال</p>
                  <p>الرواتب: {summary.salaryExpense.toLocaleString()} ريال</p>
                  <p>الإيجار: {summary.rentExpense.toLocaleString()} ريال</p>
                  <p>تكلفة الفحص: {summary.inspectionExpense.toLocaleString()} ريال</p>
                  <p>تكلفة الضمان: {summary.warrantyExpense.toLocaleString()} ريال</p>
                  <p>تكلفة التتبع: {summary.trackingExpense.toLocaleString()} ريال</p>
                  <p>تكاليف التشغيل: {summary.operatingExpense.toLocaleString()} ريال</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">ملخص الأرباح</h3>
                <div className="space-y-2">
                  <p>إجمالي الدخل السنوي: {summary.totalAnnualIncome.toLocaleString()} ريال</p>
                  <p className={`text-xl font-bold ${summary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    صافي الربح: {summary.netProfit.toLocaleString()} ريال
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 