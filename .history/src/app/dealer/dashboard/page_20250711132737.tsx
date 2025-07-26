'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import WalletSummary from '@/components/WalletSummary';
import DealerSalesHistory from '@/components/DealerSalesHistory';
import MyCarsList from '@/components/MyCarsList';
import AvailableCars from '@/components/AvailableCars';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

interface DealerWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
  name: string;
  available_balance?: number;
  funded_balance?: number;
  pending_balance?: number;
}

interface DealerTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

interface TransactionEntry {
  wallet_id: string;
  amount: number;
  type: string;
  meta: {
    car_id: string;
    to?: string;
    from?: string;
  };
}

type SettleCarSaleParams = {
  carId: string;
  buyerWalletId: string;
  sellerWalletId: string;
  price: number;
  commission: number;
  transferFee: number;
  platformWalletId: string;
  showroomWalletId: string;
  supabase: SupabaseClient;
};

interface DealerDashboardProps {
  supabase: SupabaseClient;
}

export default function DealerDashboard() {
  const [wallet, setWallet] = useState<DealerWallet | null>(null);
  const [transactions, setTransactions] = useState<DealerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // فلاتر العمليات المالية
  const [filterType, setFilterType] = useState<string>('all');
  const [filterText, setFilterText] = useState<string>('');
  const [filterFrom, setFilterFrom] = useState<string>('');
  const [filterTo, setFilterTo] = useState<string>('');

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    setIsLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('❌ لم يتم العثور على مستخدم مسجل دخول', error);
      setUserId(null);
      setIsLoading(false);
    } else {
      console.log('✅ تم العثور على المستخدم:', data.user);
      setUserId(data.user.id);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchWallet();
      fetchTransactions();
    }
  }, [userId]);

  async function fetchWallet() {
    try {
      console.log('🔍 جاري البحث عن المحفظة للمستخدم:', userId);
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ خطأ في جلب المحفظة:', error);
        setWallet(null);
      } else {
        setWallet(data);
      }
    } catch (error) {
      console.error('❌ خطأ غير متوقع:', error);
      setWallet(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('showroom_transactions')
        .select('*')
        .eq('dealer_id', userId);

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  // تصفية العمليات حسب الفلاتر
  const filteredTransactions = transactions.filter(tx => {
    let pass = true;
    if (filterType !== 'all') {
      if (filterType === 'commission') pass = pass && tx.description?.includes('عمولة');
      else if (filterType === 'ownership') pass = pass && tx.description?.includes('نقل ملكية');
      else if (filterType === 'fee') pass = pass && tx.description?.includes('رسوم');
      else if (filterType === 'deposit') pass = pass && tx.type === 'credit';
      else if (filterType === 'withdraw') pass = pass && tx.type === 'debit';
    }
    if (filterText) {
      pass = pass && (tx.description?.includes(filterText) || tx.id?.includes(filterText));
    }
    if (filterFrom) {
      pass = pass && new Date(tx.created_at) >= new Date(filterFrom);
    }
    if (filterTo) {
      pass = pass && new Date(tx.created_at) <= new Date(filterTo);
    }
    return pass;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">❌ يرجى تسجيل الدخول أولاً</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-5xl">💼</div>
          <h2 className="text-xl font-bold mb-4">لم يتم العثور على محفظة</h2>
          <p className="text-gray-600 mb-6">
            البريد الإلكتروني: {userId ? userId : 'لم يتم التعرف على المستخدم'}
          </p>
          <p className="text-gray-600 mb-6">
            يبدو أنه لا يوجد لديك محفظة مفعلة بعد. يرجى التواصل مع الإدارة لتفعيل محفظتك.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                const adminContact = `/contact-admin?user=${encodeURIComponent(userId || '')}`;
                window.location.href = adminContact;
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📞 تواصل مع الإدارة
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🏠 العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-500">🚀 صفحة التاجر</h1>
        <a
          href="/dashboard/settlements"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <span>💰 مراقبة التسويات</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        </a>
      </div>

      {/* ملخص الرصيد */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-blue-800 mb-1">الرصيد الحالي</div>
          <div className="text-2xl font-extrabold text-blue-900">{wallet?.balance?.toLocaleString() ?? 0} ريال</div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-green-800 mb-1">الرصيد الحر (قابل للسحب)</div>
          <div className="text-2xl font-extrabold text-green-900">{wallet?.available_balance?.toLocaleString?.() ?? '—'} ريال</div>
          {!wallet?.available_balance && <div className="text-xs text-gray-500 mt-1">(سيتم تفعيلها قريبًا)</div>}
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-yellow-800 mb-1">الرصيد الممول (غير قابل للسحب)</div>
          <div className="text-2xl font-extrabold text-yellow-900">{wallet?.funded_balance?.toLocaleString?.() ?? '—'} ريال</div>
          {!wallet?.funded_balance && <div className="text-xs text-gray-500 mt-1">(سيتم تفعيلها قريبًا)</div>}
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-gray-800 mb-1">الرصيد المعلق</div>
          <div className="text-2xl font-extrabold text-gray-900">{wallet?.pending_balance?.toLocaleString?.() ?? '—'} ريال</div>
          {!wallet?.pending_balance && <div className="text-xs text-gray-500 mt-1">(سيتم تفعيلها قريبًا)</div>}
        </div>
      </div>

      {/* إجمالي العمولات والرسوم */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-green-800 mb-1">إجمالي عمولات المنصة</div>
          <div className="text-2xl font-extrabold text-green-900">
            {filteredTransactions.filter(tx => tx.description?.includes('عمولة')).reduce((sum, tx) => sum + Math.abs(tx.amount), 0).toLocaleString()} ريال
          </div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-yellow-800 mb-1">إجمالي رسوم نقل الملكية</div>
          <div className="text-2xl font-extrabold text-yellow-900">
            {filteredTransactions.filter(tx => tx.description?.includes('نقل ملكية')).reduce((sum, tx) => sum + Math.abs(tx.amount), 0).toLocaleString()} ريال
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-gray-800 mb-1">إجمالي الرسوم الأخرى</div>
          <div className="text-2xl font-extrabold text-gray-900">
            {filteredTransactions.filter(tx => tx.description && !tx.description.includes('عمولة') && !tx.description.includes('نقل ملكية') && tx.description.includes('رسوم')).reduce((sum, tx) => sum + Math.abs(tx.amount), 0).toLocaleString()} ريال
          </div>
        </div>
      </div>

      {/* شريط الفلاتر */}
      <div className="flex flex-wrap gap-4 items-end mb-6 bg-blue-50 p-4 rounded-lg">
        <div>
          <label className="block mb-1 text-sm font-bold text-blue-900">نوع العملية</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border rounded p-2">
            <option value="all">الكل</option>
            <option value="commission">عمولة منصة</option>
            <option value="ownership">رسوم نقل ملكية</option>
            <option value="fee">رسوم أخرى</option>
            <option value="deposit">إيداع/إضافة</option>
            <option value="withdraw">سحب/خصم</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-bold text-blue-900">من تاريخ</label>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className="border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-bold text-blue-900">إلى تاريخ</label>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className="border rounded p-2" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-bold text-blue-900">بحث حر</label>
          <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="بحث في الوصف أو رقم العملية..." className="border rounded p-2 w-full" />
        </div>
        <button onClick={() => { setFilterType('all'); setFilterText(''); setFilterFrom(''); setFilterTo(''); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">مسح الفلاتر</button>
      </div>

      {/* جدول العمليات المالية */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-700">جدول العمليات المالية</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border-b">التاريخ والوقت</th>
                <th className="px-4 py-2 border-b">نوع العملية</th>
                <th className="px-4 py-2 border-b">المبلغ</th>
                <th className="px-4 py-2 border-b">الرصيد بعد العملية</th>
                <th className="px-4 py-2 border-b">الوصف</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">لا توجد عمليات مالية مطابقة للفلاتر.</td>
                </tr>
              )}
              {filteredTransactions.length > 0 && (() => {
                let runningBalance = wallet?.balance ?? 0;
                // العمليات مرتبة من الأحدث للأقدم، نحتاج عكسها لحساب الرصيد التراكمي بشكل صحيح
                const txs = [...filteredTransactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                // سنحسب الرصيد بعد كل عملية
                return txs.map((tx, idx) => {
                  runningBalance += tx.type === 'credit' ? -tx.amount : tx.amount;
                  return (
                    <tr key={tx.id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-center">{new Date(tx.created_at).toLocaleString('ar-SA')}</td>
                      <td className="px-4 py-2 text-center">
                        {tx.type === 'credit' ? 'إيداع/إضافة' : tx.type === 'debit' ? 'سحب/خصم' : tx.type}
                      </td>
                      <td className={`px-4 py-2 text-center font-bold ${tx.type === 'credit' ? 'text-green-700' : 'text-red-700'}`}>{tx.amount.toLocaleString()} ريال</td>
                      <td className="px-4 py-2 text-center">{runningBalance.toLocaleString()} ريال</td>
                      <td className="px-4 py-2 text-center">{tx.description || '-'}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-6">
        {/* القسم الأيسر - عرض السيارات المتاحة */}
        <div className="w-1/3 space-y-6">
          {/* ملخص المحفظة */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-black">💰 ملخص المحفظة</h2>
            <WalletSummary />
          </div>

          {/* سيارات التاجر الحالية */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-black">🚗 سياراتي الحالية</h2>
            <MyCarsList />
          </div>

          {/* سجل المبيعات */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-black">📜 سجل المبيعات</h2>
            <DealerSalesHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

// دالة تسوية عملية بيع سيارة
async function settleCarSale({
  carId,
  buyerWalletId,
  sellerWalletId,
  price,
  commission,
  transferFee,
  platformWalletId,
  showroomWalletId,
  supabase
}: SettleCarSaleParams) {
  // 1. خصم المبلغ من المشتري
  await recordTransaction({
    wallet_id: buyerWalletId,
    amount: -price,
    type: 'purchase',
    meta: { car_id: carId, to: sellerWalletId }
  }, supabase);

  // 2. إضافة المبلغ (ناقص العمولة والرسوم) للبائع
  await recordTransaction({
    wallet_id: sellerWalletId,
    amount: price - commission - transferFee,
    type: 'sale_income',
    meta: { car_id: carId, from: buyerWalletId }
  }, supabase);

  // 3. تحويل عمولة المنصة
  await recordTransaction({
    wallet_id: platformWalletId,
    amount: commission,
    type: 'platform_commission',
    meta: { car_id: carId, from: buyerWalletId }
  }, supabase);

  // 4. تحويل رسوم نقل الملكية للمعرض
  await recordTransaction({
    wallet_id: showroomWalletId,
    amount: transferFee,
    type: 'ownership_transfer_fee',
    meta: { car_id: carId, from: buyerWalletId }
  }, supabase);
}

// دالة تسجيل معاملة واحدة
async function recordTransaction(entry: TransactionEntry, supabase: SupabaseClient) {
  await supabase.from('transactions').insert([entry]);
}