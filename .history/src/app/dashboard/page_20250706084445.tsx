'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DealerWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<DealerWallet | null>(null);

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
      fetchWallet(data.user.id);
    }
  }

  async function fetchWallet(userId: string) {
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
        console.log('✅ تم العثور على المحفظة:', data);
        setWallet(data);
      }
    } catch (error) {
      console.error('❌ خطأ غير متوقع:', error);
      setWallet(null);
    } finally {
      setIsLoading(false);
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

  if (!wallet) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-5xl">💼</div>
          <h2 className="text-xl font-bold mb-4">لم يتم العثور على محفظة</h2>
          <p className="text-gray-600 mb-6">
            البريد الإلكتروني: {userId}
          </p>
          <p className="text-gray-600 mb-6">
            يبدو أنه لا يوجد لديك محفظة مفعلة بعد. يرجى التواصل مع الإدارة لتفعيل محفظتك.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                const adminContact = `/contact-admin?user=${encodeURIComponent(userId)}`;
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
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
          <span>محفظة المنصة</span>
          <span className="text-2xl">💰</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-500 rounded-lg p-6 text-white">
          <h2 className="text-xl mb-2">تاريخ التحديث</h2>
          <p className="text-2xl font-bold">{new Date(wallet.updated_at).toLocaleDateString('ar-SA')}</p>
        </div>

        <div className="bg-green-500 rounded-lg p-6 text-white">
          <h2 className="text-xl mb-2">معرف المحفظة</h2>
          <p className="text-lg font-mono break-all">{wallet.id}</p>
        </div>

        <div className="bg-blue-500 rounded-lg p-6 text-white">
          <h2 className="text-xl mb-2">الرصيد الحالي</h2>
          <p className="text-2xl font-bold">{wallet.balance.toLocaleString()} ريال</p>
        </div>
      </div>
    </div>
  );
}
