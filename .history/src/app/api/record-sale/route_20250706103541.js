// حساب العمولة
const commission = calculatePlatformFee(salePrice);

// 1️⃣ سجل الخصم من حساب البائع
await supabase.from('showroom_transactions').insert([{
  showroom_id: sellerId,
  type: 'platform_commission',
  amount: -commission,
  description: `عمولة المنصة من بيع سيارة بسعر ${salePrice}`
}]);

// 2️⃣ خصم من رصيد البائع
await supabase.rpc('decrement_wallet_balance', {
  showroom_id_input: sellerId,
  decrement_amount: commission
});

// 3️⃣ سجل الإضافة في حساب المنصة
await supabase.from('showroom_transactions').insert([{
  showroom_id: PLATFORM_ACCOUNT_UUID,
  type: 'platform_commission',
  amount: commission,
  description: `عمولة مستلمة من بيع سيارة بسعر ${salePrice}`
}]);

// 4️⃣ إضافة في رصيد المنصة
await supabase.rpc('increment_wallet_balance', {
  showroom_id_input: PLATFORM_ACCOUNT_UUID,
  increment_amount: commission
});
