import { supabase } from './supabase'

// مثال لدالة جلب بيانات من جدول "installment_rules"
export async function fetchInstallmentRules() {
  const { data, error } = await supabase.from('installment_rules').select('*')
  if (error) throw new Error(error.message)
  return data
}
