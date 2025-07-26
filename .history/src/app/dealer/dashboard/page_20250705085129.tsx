'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DealerDashboard() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  async function fetchWallet() {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching wallet:', error);
    } else {
      setWallet(data);
    }
  }

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data);
    }
  }

  async function handlePurchase() {
    const amount = parseFloat(purchaseAmount);
    if (!wallet || isNaN(amount) || amount <= 0) {
      setMessage('❌ مبلغ غير صالح');
      return;
    }

    const availableFunds =
      wallet.balance_personal + (wallet.balance_limit - wallet.balance_approved);

    if (amount > availableFunds) {
      setMessage('❌ لا يوجد رصيد كافٍ للشراء.');
      return;
    }

    let personalDeduction = Math.min(wallet.balance_personal, amount);
    let approvedDeduction = amount - personalDeduction;

    // تحديث الرصيد في Supabase
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance_personal: wallet.balance_personal - personalDeduction,
        balance_approved: wallet.balance_approved + approvedDeduction,
      })
      .eq('id', wallet.id);

    if (updateError) {
      console.error('Error updating wallet:', updateError);
      setMessage('❌ فشل في تنفيذ العملية.');
      return;
    }

    // إضافة سجل المعاملة
    const { error: insertError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: wallet.user_id,
          amount,
          source: approvedDeduction > 0 ? 'mixed' : 'personal',
        },
      ]);

    if (insertError) {
      console.error('Error inserting transaction:', insertError);
      setMessage('❌ فشل في تسجيل المعاملة.');
      return;
    }

    setMessage('✅ تمت عملية الشراء بنجاح!');
    setPurchaseAmount('');
    fetchWallet();
    fetchTransactions();
  }

  if (!wallet) return <p>🔄 جاري تحميل البيانات...</p>;

  const availableFunds =
    wallet.balance_personal + (wallet.balance_limit - wallet.balance_approved);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>🚀 لوحة تحكم التاجر</h2>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>💰 رصيدك</h3>
        <p>رصيد شخصي: {wallet.balance_personal.toLocaleString()} ريال</p>
        <p>الممول المستخدم: {wallet.balance_approved.toLocaleString()} ريال</p>
        <p>حد التمويل: {wallet.balance_limit.toLocaleString()} ريال</p>
        <p>
          ✅ قدرتك الشرائية: <strong>{availableFunds.toLocaleString()} ريال</strong>
        </p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>🛒 عملية شراء</h3>
        <input
          type="number"
          placeholder="أدخل مبلغ الشراء"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
        />
        <button onClick={handlePurchase} style={{ marginLeft: '1rem' }}>
          ✅ نفذ الشراء
        </button>
        {message && <p>{message}</p>}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h3>📜 سجل المشتريات</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>الخصم من</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                <td>{tx.amount.toLocaleString()} ريال</td>
                <td>{tx.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
