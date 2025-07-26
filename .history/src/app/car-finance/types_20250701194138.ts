export interface InstallmentRule {
  id: number;
  price_category: number;
  duration_months: number;
  quantity: number;
  down_payment_value: number;
  last_payment_value: number;
  financed_amount: number;
  profit_per_car: number;
  sale_price: number;
  monthly_installment: number;
  total_monthly_income: number;
  total_profit: number;
} 