/**
 * صفحة التقارير المالية - Finance Reports Dashboard
 *
 * الموقع: /admin/dashboard/finance-reports
 *
 * وصف:
 *   تعرض هذه الصفحة ملخصات الأداء المالي على مستوى التمويل والتقسيط،
 *   وتشمل:
 *     - إحصائيات عامة (رأس المال، الأرباح، عدد السيارات...)
 *     - رسم بياني تفاعلي لتطور الأرباح الشهرية
 *     - جداول تقارير مالية شهرية وربعية
 *
 * تعتمد على بيانات حقيقية من قاعدة Supabase، من الجداول:
 *   - finance_models
 *   - installments
 *   - transactions
 *   - wallets
 *
 * ملاحظات الاستخدام:
 *   - جميع القيم الإحصائية قابلة للتحديث تلقائي من الكنترول روم
 *   - سيتم لاحقًا إضافة فلاتر زمنية وتصدير Excel/PDF
 *
 * تاريخ الإنشاء: يونيو 2025
 * تم الإنشاء بواسطة: فريق DASM-e (بإشراف محمد الزهراني)
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinanceTable from '@/components/FinanceTable';
import { supabase } from '@/lib/services/supabase';

export default function FinanceReportsPage() {
  const [stats, setStats] = useState({
    totalCapital: 0,
    expectedProfit: 0,
    carCount: 0,
    paidInstallments: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [installmentsData, setInstallmentsData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: models, error: modelsError } = await supabase
        .from('finance_models')
        .select('price, profit_rate');

      const { data: payments, error: paymentsError } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('type', 'installment_payment');

      if (modelsError || paymentsError) return;

      const totalCapital = models.reduce((sum, m) => sum + (m.price || 0), 0);
      const expectedProfit = models.reduce((sum, m) => sum + (m.price * (m.profit_rate / 100)), 0);
      const carCount = models.length;
      const paidInstallments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      const monthlyProfits = {};
      for (const p of payments) {
        const month = new Date(p.created_at).toLocaleString('ar-SA', { month: 'long' });
        monthlyProfits[month] = (monthlyProfits[month] || 0) + p.amount;
      }
      const chartFormatted = Object.entries(monthlyProfits).map(([month, value]) => ({
        name: month,
        profit: value,
      }));

      setStats({ totalCapital, expectedProfit, carCount, paidInstallments });
      setChartData(chartFormatted);
    };

    const fetchInstallments = async () => {
      const { data, error } = await supabase
        .from('installments')
        .select('*')
        .order('start_date', { ascending: false });

      if (!error && data) {
        setInstallmentsData(data);
      }
    };

    fetchStats();
    fetchInstallments();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">التقارير المالية</h1>
      <p className="text-muted-foreground">عرض شامل لأداء التمويل والتقسيط.</p>

      {/* البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">إجمالي رأس المال</p>
            <p className="text-2xl font-bold">{stats.totalCapital.toLocaleString()} ريال</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">الأرباح المتوقعة</p>
            <p className="text-2xl font-bold">{stats.expectedProfit.toLocaleString()} ريال</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">عدد السيارات الممولة</p>
            <p className="text-2xl font-bold">{stats.carCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">الدفعات المسددة</p>
            <p className="text-2xl font-bold">{stats.paidInstallments.toLocaleString()} ريال</p>
          </CardContent>
        </Card>
      </div>

      {/* المخطط البياني */}
      <div className="bg-white dark:bg-muted border rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">تطور الأرباح الشهرية</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* الجدول */}
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">تقرير شهري</TabsTrigger>
          <TabsTrigger value="quarterly">تقرير ربعي</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <FinanceTable type="monthly" data={installmentsData} />
        </TabsContent>
        <TabsContent value="quarterly">
          <FinanceTable type="quarterly" data={installmentsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
