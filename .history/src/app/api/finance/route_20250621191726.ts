import { NextResponse } from 'next/server';

// ⚠️ البيانات مؤقتة لاختبار الواجهة بدون قاعدة بيانات
export async function GET() {
  try {
    const fakeData = [
      {
        id: 1,
        priceCategory: 50000,
        quantity: 3,
        downPaymentRate: 0.3,
        installmentPlanId: 1,
        inspectionCost: 500,
        warrantyCost: 300,
        trackingCost: 200,
      },
      {
        id: 2,
        priceCategory: 80000,
        quantity: 2,
        downPaymentRate: 0.25,
        installmentPlanId: 2,
        inspectionCost: 600,
        warrantyCost: 400,
        trackingCost: 250,
      }
    ];

    return NextResponse.json({ success: true, data: fakeData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع في السيرفر' });
  }
}
