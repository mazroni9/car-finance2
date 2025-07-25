// src/lib/utils/finance.ts

interface CarData {
    make: string;
    model: string;
    year: number;
    price: number;
    [key: string]: any;
  }
  
  export const validateCarData = (data: any) => {
    const requiredFields = ['make', 'model', 'year', 'price'];
    const errors = requiredFields.filter((field) => !data[field]);
  
    return {
      isValid: errors.length === 0,
      errors: errors.map((field) => `Missing required field: ${field}`)
    };
  };
  
  export const calculateFinancials = (data: any, plan: any) => {
    const downPayment = data.priceCategory * (data.downPaymentRate / 100);
    const monthlyIncome = (data.priceCategory - downPayment) / plan.months;
  
    return {
      downPayment,
      monthlyIncome,
      annualIncome: monthlyIncome * 12,
      sellingPrice: data.priceCategory + (data.priceCategory * plan.profit_rate / 100)
    };
  };
  