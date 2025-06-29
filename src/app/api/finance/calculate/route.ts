import { NextResponse } from 'next/server';

const PROFIT_RATES = {
  12: 0.30,  // 30% for 12 months
  24: 0.50,  // 50% for 24 months
  36: 0.65   // 65% for 36 months
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!data.priceCategory || !data.downPaymentRate || !data.lastPaymentRate || !data.months) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة المدخلات
    if (data.priceCategory <= 0) {
      return NextResponse.json(
        { error: 'سعر السيارة يجب أن يكون أكبر من صفر' },
        { status: 400 }
      );
    }

    if (data.downPaymentRate < 0.1 || data.downPaymentRate > 0.2) {
      return NextResponse.json(
        { error: 'نسبة الدفعة الأولى يجب أن تكون بين 10% و 20%' },
        { status: 400 }
      );
    }

    if (data.lastPaymentRate < 0.1 || data.lastPaymentRate > 0.2) {
      return NextResponse.json(
        { error: 'نسبة الدفعة الأخيرة يجب أن تكون بين 10% و 20%' },
        { status: 400 }
      );
    }

    if (![12, 24, 36].includes(data.months)) {
      return NextResponse.json(
        { error: 'مدة التقسيط يجب أن تكون 12 أو 24 أو 36 شهر' },
        { status: 400 }
      );
    }

    // الحصول على نسبة الربح
    const profitRate = PROFIT_RATES[data.months as keyof typeof PROFIT_RATES];
    
    // حساب الدفعات
    const downPayment = Math.round(data.priceCategory * data.downPaymentRate);
    const lastPayment = Math.round(data.priceCategory * data.lastPaymentRate);
    
    // المبلغ المتبقي للتقسيط (بدون الدفعة الأولى والأخيرة)
    const remainingAmount = data.priceCategory - downPayment - lastPayment;
    
    // حساب الربح على المبلغ المتبقي فقط
    const profitAmount = Math.round(remainingAmount * profitRate);
    
    // إجمالي المبلغ المقسط مع الربح
    const totalInstallmentAmount = remainingAmount + profitAmount;
    
    // القسط الشهري
    const monthlyPayment = Math.round(totalInstallmentAmount / data.months);
    
    // إجمالي المبلغ = الأقساط + الدفعة الأولى + الدفعة الأخيرة
    const totalAmount = (monthlyPayment * data.months) + downPayment + lastPayment;

    return NextResponse.json({
      success: true,
      data: {
        downPayment,
        lastPayment,
        remainingAmount,
        monthlyPayment,
        totalAmount,
        profitAmount,
        profitRate: profitRate * 100,
        months: data.months
      }
    });

  } catch (error) {
    console.error('Error in finance calculation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حساب التمويل' },
      { status: 500 }
    );
  }
} 