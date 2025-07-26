import { NextResponse } from 'next/server';
import { executeQuery, validateCarData, calculateFinancials } from '@/lib/db';
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

    const result = await executeQuery(`
      SELECT 
        c.*,
        ip.months,
        ip.profit_rate,
        (c.selling_price - c.down_payment - c.last_payment) / ip.months as monthly_payment
      FROM cars c
      JOIN installment_plans ip ON c.installment_plan_id = ip.id
      ORDER BY ip.months, c.price_category
    `);

    if (!result.success) {
      console.error('Database error:', result.error);
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
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
    const planResult = await executeQuery(
      'SELECT * FROM installment_plans WHERE id = $1',
      [data.installmentPlanId]
    );

    if (!planResult.success || !planResult.data.length) {
      return NextResponse.json(
        { error: 'خطة التقسيط غير موجودة' },
        { status: 400 }
      );
    }

    const plan = planResult.data[0];

    // حساب القيم المالية
    const financials = calculateFinancials(data, plan);

    // إضافة السيارة
    const insertResult = await executeQuery(`
      INSERT INTO cars (
        price_category, quantity, down_payment_rate, down_payment, last_payment,
        monthly_income, annual_income, inspection_cost, warranty_cost, tracking_cost,
        purchase_cost, selling_price, installment_plan_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      data.priceCategory,
      data.quantity,
      data.downPaymentRate,
      financials.downPayment,
      financials.downPayment,
      financials.monthlyIncome,
      financials.annualIncome,
      data.inspectionCost,
      data.warrantyCost,
      data.trackingCost,
      data.priceCategory * data.quantity,
      financials.sellingPrice,
      data.installmentPlanId
    ]);

    if (!insertResult.success) {
      console.error('Database error:', insertResult.error);
      return NextResponse.json(
        { error: 'فشل في إضافة السيارة', details: insertResult.error },
        { status: 500 }
      );
    }

    // تحديث الملخص المالي
    await executeQuery(`
      UPDATE financial_summaries
      SET 
        total_annual_income = total_annual_income + $1,
        inspection_expense = inspection_expense + $2,
        warranty_expense = warranty_expense + $3,
        tracking_expense = tracking_expense + $4,
        net_profit = (total_annual_income + $1) - (total_annual_cost + $5)
      WHERE id = 1
    `, [
      financials.annualIncome,
      data.inspectionCost * data.quantity,
      data.warrantyCost * data.quantity,
      data.trackingCost * data.quantity,
      (data.inspectionCost + data.warrantyCost + data.trackingCost) * data.quantity
    ]);

    return NextResponse.json(insertResult.data[0]);
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