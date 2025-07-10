// src/types/finance.ts

/**
 * ✅ السيارة
 */
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl?: string;
  color: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ✅ تمثل إدخالًا خامًا في جدول التمويل (العمليات)
 */
export interface FinanceRecord {
  id: string;
  carId: string;
  downPayment: number;
  lastPayment: number;
  sellingPrice: number;
  monthlyPayment: number;
  profitAmount: number;
  profitRate: number;
  months: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ✅ قاعدة (Rule) مستخدمة لحساب الأقساط
 */
export interface InstallmentRule {
  id: string;
  priceCategory: number;
  durationMonths: number;
  profitTargetPercent: number;
  downPaymentValue: number;
  lastPaymentValue: number;
  quantity: number;
  monthlyInstallment: number;
  monthlyIncome: number;
  annualIncome: number;
  possiblePurchaseAmount: number;
  trackingCost: number;
  guaranteeContractCost: number;
  inspectionCost: number;
  profitPerCar: number;
  totalMonthlyProfit: number;
  totalProfitFullPeriod: number;
  roiFullPeriod: number;
  roiAnnual: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ✅ ملخص مالي سنوي أو عام
 */
export interface FinancialSummary {
  id: string;
  totalAnnualCost: number;
  totalAnnualIncome: number;
  salaryExpense: number;
  rentExpense: number;
  inspectionExpense: number;
  warrantyExpense: number;
  trackingExpense: number;
  operatingExpense: number;
  netProfit: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ✅ نتيجة عملية حساب القسط
 * غالبًا للاستخدام الداخلي
 */
export interface CalculationResult {
  downPayment: number;
  lastPayment: number;
  sellingPrice: number;
  monthlyPayment: number;
  totalAmount: number;
  profitAmount: number;
  profitRate: number;
  months: number;
}

/**
 * ✅ المحفظة المالية
 * تستخدم في جميع عمليات الخصم/الإضافة
 */
export interface Wallet {
  id: string;
  user_id: string;
  type: string;         // مثل 'personal' أو 'showroom' أو 'platform'
  balance: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * ✅ سجل التسوية المالية بين المحافظ
 */
export interface Settlement {
  id: string;
  type: 'car_sale' | 'showroom_fee' | 'traffic_fee' | 'platform_fee' | string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  car_id?: string;
  buyer_id?: string;
  seller_id?: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * ✅ الطلب المرسل إلى /api/purchase-car
 */
export interface PurchaseCarRequest {
  buyerWalletId: string;
  showroomWalletId: string;
  platformWalletId: string;
  totalPrice: number;
}
