// src/lib/utils/finance.ts

interface FinanceData {
  priceCategory: number
  downPaymentRate: number
}

interface InstallmentPlan {
  months: number
  profit_rate: number
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

interface CarData {
  make: string
  model: string
  year: number
  price: number
}

export const validateCarData = (data: Partial<CarData>): ValidationResult => {
  const requiredFields = ['make', 'model', 'year', 'price'] as const
  const errors = requiredFields.filter((field) => !data[field])

  return {
    isValid: errors.length === 0,
    errors: errors.map((field) => `Missing required field: ${field}`)
  }
}

export const calculateFinancials = (data: FinanceData, plan: InstallmentPlan) => {
  const downPayment = data.priceCategory * (data.downPaymentRate / 100)
  const monthlyIncome = (data.priceCategory - downPayment) / plan.months

  return {
    downPayment,
    monthlyIncome,
    annualIncome: monthlyIncome * 12,
    sellingPrice: data.priceCategory + (data.priceCategory * plan.profit_rate / 100)
  }
}
  