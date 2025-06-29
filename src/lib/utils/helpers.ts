// تنسيق العملة السعودية
export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ar-EG')} ريال`
}

// تحويل التاريخ إلى تنسيق سعودي (هجري لاحقًا لو أردت)
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// حساب النسبة المئوية من قيمة معينة
export function calculatePercentage(base: number, percentage: number): number {
  return Math.round((base * percentage) / 100)
}

// حساب المبلغ المتبقي بعد دفعة أولى
export function remainingAmount(total: number, upfront: number): number {
  return total - upfront
}

// حساب دفعة شهرية (تقريبية - بدون فوائد مركبة)
export function calculateMonthlyInstallment(total: number, months: number): number {
  if (months <= 0) return total
  return Math.round(total / months)
}

// تحديد إذا كانت القيمة موجبة أو سالبة
export function isPositive(value: number): boolean {
  return value >= 0
}

// تنسيق رقم مع علامة موجبة أو سالبة
export function formatSigned(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toLocaleString()}`
}
