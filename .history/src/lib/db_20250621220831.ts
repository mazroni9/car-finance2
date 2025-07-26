// import { PrismaClient } from '@prisma/client'

// Temporary mock Prisma client
export const prisma = {
  car: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  }
};

// ✅ نموذج بيانات السيارة
export interface CarData {
  priceCategory: number;
  quantity: number;
  downPaymentRate: number;
  installmentPlanId: number;
  inspectionCost: number;
  warrantyCost: number;
  trackingCost: number;
}

// ✅ نموذج خطة التقسيط
export interface InstallmentPlan {
  id: number;
  months: number;
  profitRate: number;
}

// ✅ نتيجة الحسابات المالية
export interface FinancialCalculation {
  downPayment: number;
  sellingPrice: number;
  monthlyPayment: number;
  monthlyIncome: number;
  annualIncome: number;
}

// ✅ دالة التحقق من صحة بيانات السيارة
export function validateCarData(data: CarData) {
  const errors: string[] = [];

  if (!data.priceCategory || data.priceCategory <= 0) {
    errors.push('الفئة السعرية غير صحيحة');
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.push('عدد السيارات غير صحيح');
  }

  if (!data.downPaymentRate || data.downPaymentRate < 0.1 || data.downPaymentRate > 0.5) {
    errors.push('نسبة الدفعة الأولى غير صحيحة');
  }

  if (!data.installmentPlanId) {
    errors.push('خطة التقسيط غير محددة');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ✅ دالة حساب التمويل
export function calculateFinancials(carData: CarData, installmentPlan: InstallmentPlan): FinancialCalculation {
  const downPayment = Math.round(carData.priceCategory * carData.downPaymentRate);
  const sellingPrice = Math.round(carData.priceCategory * (1 + installmentPlan.profitRate));
  const monthlyPayment = Math.round((sellingPrice - downPayment * 2) / installmentPlan.months);

  return {
    downPayment,
    sellingPrice,
    monthlyPayment,
    monthlyIncome: monthlyPayment * carData.quantity,
    annualIncome: monthlyPayment * carData.quantity * 12,
  };
}
