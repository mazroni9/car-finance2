'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import WalletSummary from '@/components/WalletSummary';
import DealerSalesHistory from '@/components/DealerSalesHistory';
import MyCarsList from '@/components/MyCarsList';
import AvailableCars from '@/components/AvailableCars';
import Image from 'next/image';

interface DealerWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
  name: string;
}

interface DealerTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export default function DealerDashboard() {
  const [wallet, setWallet] = useState<DealerWallet | null>(null);
  const [transactions, setTransactions] = useState<DealerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

  if (!wallet || wallet.status !== 'active') {
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

      <div className="flex gap-6">
        {/* القسم الأيسر - عرض السيارات المتاحة */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <AvailableCars />
        </div>

        {/* القسم الأيمن - ملخص المحفظة والسيارات الحالية وسجل المبيعات */}
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
}) {
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
async function recordTransaction(entry, supabase) {
  await supabase.from('transactions').insert([entry]);
}