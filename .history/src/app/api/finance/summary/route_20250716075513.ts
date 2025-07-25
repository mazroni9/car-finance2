import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Environment variables missing');
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    console.log('🔍 جاري حساب ملخص التمويل...');

    // استخدام Function الأصلية لحساب الملخص المالي
    const { data: summaryData, error: summaryError } = await supabase
      .rpc('get_financial_summary');

    if (summaryError) {
      console.error('❌ خطأ في حساب الملخص المالي:', summaryError);
      
      // إذا فشلت Function، نحسب يدوياً
      console.log('🔄 جاري الحساب اليدوي...');
      
      // جلب بيانات طلبات التمويل
      const { data: financingRequests, error: financingError } = await supabase
        .from('financing_requests')
        .select('*')
        .eq('status', 'approved');

      if (financingError) {
        console.error('❌ خطأ في جلب طلبات التمويل:', financingError);
        return NextResponse.json({ error: 'Failed to fetch financing data' }, { status: 500 });
      }

      // جلب بيانات السيارات
      const { data: cars, error: carsError } = await supabase
        .from('car_showcase')
        .select('*')
        .eq('status', 'available');

      if (carsError) {
        console.error('❌ خطأ في جلب السيارات:', carsError);
        return NextResponse.json({ error: 'Failed to fetch cars data' }, { status: 500 });
      }

      // حساب البيانات المالية يدوياً
      const totalMonthlyInstallments = financingRequests?.reduce((sum, req) => {
        return sum + (req.monthly_payment || 0);
      }, 0) || 0;

      const totalFirstPayments = financingRequests?.reduce((sum, req) => {
        return sum + (req.down_payment || 0);
      }, 0) || 0;

      const totalLastAnnualPayments = financingRequests?.reduce((sum, req) => {
        return sum + (req.final_payment || 0);
      }, 0) || 0;

      // حساب إجمالي تكلفة الشراء
      const totalPurchaseCost = cars?.reduce((sum, car) => {
        return sum + (car.price || 0);
      }, 0) || 0;

      // حساب إجمالي الدخل السنوي (الأقساط الشهرية × 12)
      const totalAnnualIncome = totalMonthlyInstallments * 12;

      // حساب الربح السنوي قبل التكاليف
      const totalAnnualProfitBeforeCosts = totalAnnualIncome - totalPurchaseCost;

      // حساب متوسط ROI السنوي
      const avgRoiAnnual = totalPurchaseCost > 0 ? (totalAnnualProfitBeforeCosts / totalPurchaseCost) : 0;

      // حساب متوسط ROI كامل الفترة (افتراضي 5 سنوات)
      const avgRoiFullPeriod = totalPurchaseCost > 0 ? (totalAnnualProfitBeforeCosts * 5 / totalPurchaseCost) : 0;

      // حساب إجمالي الربح الكامل
      const totalFullProfit = totalAnnualProfitBeforeCosts;

      const summary = {
        total_monthly_installments: totalMonthlyInstallments,
        total_first_payments: totalFirstPayments,
        total_last_annual_payments: totalLastAnnualPayments,
        total_annual_income: totalAnnualIncome,
        total_purchase_cost: totalPurchaseCost,
        total_annual_profit_before_costs: totalAnnualProfitBeforeCosts,
        avg_roi_annual: avgRoiAnnual,
        avg_roi_full_period: avgRoiFullPeriod,
        total_full_profit: totalFullProfit,
        financing_requests_count: financingRequests?.length || 0,
        cars_count: cars?.length || 0
      };

      console.log('✅ تم الحساب اليدوي بنجاح:', summary);
      return NextResponse.json(summary);
    }

    // إذا نجحت Function الأصلية
    console.log('✅ تم الحساب باستخدام Function الأصلية:', summaryData);
    return NextResponse.json(summaryData);

  } catch (error) {
    console.error('❌ خطأ عام في API ملخص التمويل:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
