import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📥 البيانات المستلمة:', body);
    
    const {
      price_category,
      duration_months,
      quantity = 1,
      down_payment_percent,
      last_payment_percent,
      profit_target_percent,
      down_payment_value,
      last_payment_value,
      monthly_installment,
      possible_purchase_amount,
      profit_per_car,
      total_sale_price
    } = body;

    // التحقق من البيانات المطلوبة
    if (!price_category || !duration_months || !down_payment_percent || !last_payment_percent) {
      return Response.json({ 
        error: '❌ البيانات المطلوبة غير مكتملة',
        details: 'يجب إرسال: price_category, duration_months, down_payment_percent, last_payment_percent'
      }, { status: 400 });
    }

    // تحقق من النسب
    if (
      down_payment_percent < 0 || down_payment_percent > 1 ||
      last_payment_percent < 0 || last_payment_percent > 1
    ) {
      return Response.json({ 
        error: '❌ النسب يجب أن تكون بين 0 و 1',
        details: `down_payment_percent: ${down_payment_percent}, last_payment_percent: ${last_payment_percent}`
      }, { status: 400 });
    }

    // حساب القيم إذا لم يتم إرسالها
    const calculatedDownPaymentValue = down_payment_value || (price_category * down_payment_percent);
    const calculatedLastPaymentValue = last_payment_value || (price_category * last_payment_percent);
    const calculatedProfitTargetPercent = profit_target_percent || 30; // افتراضي 30%
    const calculatedTotalSalePrice = total_sale_price || (price_category * (1 + calculatedProfitTargetPercent / 100));
    const calculatedPossiblePurchaseAmount = possible_purchase_amount || price_category;
    const calculatedMonthlyInstallment = monthly_installment || ((calculatedTotalSalePrice - calculatedDownPaymentValue - calculatedLastPaymentValue) / duration_months);
    const calculatedProfitPerCar = profit_per_car || (calculatedTotalSalePrice - price_category);

    // حساب التكاليف الإضافية
    const tracking_cost = quantity * 25;
    const guarantee_contract_cost = quantity * 50;
    const inspection_cost = quantity * 300;

    // تجهيز البيانات للإدخال
    const insertData = {
      price_category: Number(price_category),
      duration_months: Number(duration_months),
      profit_target_percent: Number(calculatedProfitTargetPercent),
      down_payment_value: Number(calculatedDownPaymentValue),
      last_payment_value: Number(calculatedLastPaymentValue),
      quantity: Number(quantity),
      monthly_installment: Number(calculatedMonthlyInstallment),
      possible_purchase_amount: Number(calculatedPossiblePurchaseAmount),
      tracking_cost: Number(tracking_cost),
      guarantee_contract_cost: Number(guarantee_contract_cost),
      inspection_cost: Number(inspection_cost),
      profit_per_car: Number(calculatedProfitPerCar)
    };

    console.log('✅ البيانات المحسوبة:', insertData);

    const { data, error } = await supabase
      .from('installment_rules')
      .insert([insertData])
      .select();

    if (error) {
      console.error('❌ خطأ في Supabase:', error);
      console.error('❌ تفاصيل الخطأ:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return Response.json({ 
        error: `❌ فشل في حفظ البيانات: ${error.message}`,
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    console.log('✅ تم الحفظ بنجاح:', data);
    return Response.json({ 
      success: true,
      data: data,
      message: 'تم حفظ قاعدة التمويل بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error);
    return Response.json({ 
      error: `❌ خطأ في الخادم: ${error.message}`,
      details: error.message
    }, { status: 500 });
  }
}
