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

export interface InstallmentPlan {
  id: string;
  months: number;
  profitRate: number;
  monthlyPayment: number;
  createdAt: Date;
  updatedAt: Date;
}

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