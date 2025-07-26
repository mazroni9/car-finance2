export interface InstallmentRule {
  id: number;
  price_category: number;
  duration_months: number;
  down_payment_percent: number;
  last_payment_percent: number;
  quantity: number;
  profit_value: number;
  monthly_income: number;
  profit_target_percent: number;
} 