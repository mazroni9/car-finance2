import { NextResponse } from 'next/server';
import supabase from '@/lib/services/supabase';
import { validateCarData, calculateFinancials } from '@/lib/utils/finance';
import { queryTable } from '@/lib/services/queries';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

// الحصول على جميع السيارات
export async function GET() {
  try {
    // التحقق من حد الطلبات
    try {
      await limiter.check(10, 'CARS_API');
    } catch {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const cars = await queryTable('cars', {
      columns: `
        *,
        installment_plans (
          months,
          profit_rate
        )
      `,
      orderBy: {
        column: 'price_category',
        ascending: true
      }
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// إضافة سيارة جديدة
export async function POST(request: Request) {
  try {
    // التحقق من حد الطلبات
    try {
      await limiter.check(5, 'CARS_API_POST');
    } catch {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    // التحقق من صحة البيانات
    const validation = validateCarData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: validation.errors },
        { status: 400 }
      );
    }

    // الحصول على معلومات خطة التقسيط
    const plans = await queryTable('installment_plans', {
      filters: { id: data.installmentPlanId }
    });

    if (!plans.length) {
      return NextResponse.json(
        { error: 'خطة التقسيط غير موجودة' },
        { status: 400 }
      );
    }

    const plan = plans[0];

    // حساب القيم المالية
    const financials = calculateFinancials(data, plan);

    // إضافة السيارة
    const { data: newCar, error: insertError } = await supabase
      .from('cars')
      .insert({
        price_category: data.priceCategory,
        quantity: data.quantity,
        down_payment_rate: data.downPaymentRate,
        down_payment: financials.downPayment,
        last_payment: financials.downPayment,
        monthly_income: financials.monthlyIncome,
        annual_income: financials.annualIncome,
        inspection_cost: data.inspectionCost,
        warranty_cost: data.warrantyCost,
        tracking_cost: data.trackingCost,
        purchase_cost: data.priceCategory * data.quantity,
        selling_price: financials.sellingPrice,
        installment_plan_id: data.installmentPlanId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'فشل في إضافة السيارة', details: insertError.message },
        { status: 500 }
      );
    }

    // تحديث الملخص المالي
    const { error: updateError } = await supabase
      .from('financial_summaries')
      .update({
        total_annual_income: supabase.rpc('increment', { 
          value: financials.annualIncome 
        }),
        inspection_expense: supabase.rpc('increment', { 
          value: data.inspectionCost * data.quantity 
        }),
        warranty_expense: supabase.rpc('increment', { 
          value: data.warrantyCost * data.quantity 
        }),
        tracking_expense: supabase.rpc('increment', { 
          value: data.trackingCost * data.quantity 
        }),
        net_profit: supabase.rpc('calculate_net_profit', {
          new_income: financials.annualIncome,
          new_cost: (data.inspectionCost + data.warrantyCost + data.trackingCost) * data.quantity
        })
      })
      .eq('id', 1);

    if (updateError) {
      console.error('Failed to update financial summary:', updateError);
      // Don't return error to client as the car was successfully added
    }

    return NextResponse.json(newCar);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في معالجة الطلب',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
} 