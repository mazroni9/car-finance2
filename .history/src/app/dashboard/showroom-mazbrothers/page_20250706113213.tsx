// app/dashboard/showroom-mazbrothers/page.tsx

import { createClient } from '@/app/api/supabase/server';
import React from 'react';

const MAZBROTHERS_ID = '2bf61df6-da52-45f1-88c4-05316e51df04';

export default async function ShowroomMazbrothersPage() {
  const supabase = createClient();

  // Fetch Wallet Data
  const { data: walletData, error: walletError } = await supabase
    .from('showroom_wallets')
    .select('balance, updated_at')
    .eq('showroom_id', MAZBROTHERS_ID)
    .single();

  // Fetch Transactions
  const { data: transactions, error: txError } = await supabase
    .from('showroom_transactions')
    .select('type, amount, description, created_at')
    .eq('showroom_id', MAZBROTHERS_ID)
    .order('created_at', { ascending: false });

  // Fetch Platform Commissions
  const { data: commissions, error: commError } = await supabase
    .from('platform_commissions')
    .select('sale_price, platform_fee, commission_tier_id, created_at')
    .eq('showroom_id', MAZBROTHERS_ID)
    .order('created_at', { ascending: false });

  // Handle Errors
  if (walletError || txError || commError) {
    console.error(walletError, txError, commError);
    return (
      <div className="p-6">
        ❌ حدث خطأ في تحميل البيانات
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🏬 لوحة تحكم معرض mazbrothers</h1>

      {/* Section 1: بيانات المعرض */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">📌 بيانات المعرض</h2>
        <p>اسم المعرض: <strong>mazbrothers</strong></p>
        <p>UUID: <code className="bg-gray-200 px-1">{MAZBROTHERS_ID}</code></p>
      </section>

      {/* Section 2: ملخص المحفظة */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">💰 ملخص المحفظة</h2>
        {walletData ? (
          <div>
            <p>💰 الرصيد الحالي: {walletData.balance?.toLocaleString()} ريال</p>
            <p>🗓️ آخر تحديث: {new Date(walletData.updated_at).toLocaleString()}</p>
          </div>
        ) : (
          <p>🚫 لا توجد بيانات محفظة متاحة.</p>
        )}
      </section>

      {/* Section 3: جدول العمليات */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">🧾 جدول العمليات</h2>
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">📑 النوع</th>
                  <th className="border p-2">💸 المبلغ</th>
                  <th className="border p-2">📝 الوصف</th>
                  <th className="border p-2">📅 التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="border p-2">{tx.type}</td>
                    <td className="border p-2">{tx.amount} ريال</td>
                    <td className="border p-2">{tx.description}</td>
                    <td className="border p-2">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>🚫 لا توجد عمليات مسجلة.</p>
        )}
      </section>

      {/* Section 4: جدول العمولات */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">🎯 جدول العمولات المسجلة</h2>
        {commissions && commissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">💰 السعر</th>
                  <th className="border p-2">🎯 عمولة المنصة</th>
                  <th className="border p-2">🗂️ الشريحة</th>
                  <th className="border p-2">📅 التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.sale_price?.toLocaleString()} ريال</td>
                    <td className="border p-2">{item.platform_fee} ريال</td>
                    <td className="border p-2">{item.commission_tier_id}</td>
                    <td className="border p-2">{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>🚫 لا توجد عمولات مسجلة.</p>
        )}
      </section>
    </div>
  );
}
