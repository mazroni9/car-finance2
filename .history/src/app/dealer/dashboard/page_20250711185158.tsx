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
import React, { useRef } from 'react';
import type { Settlement } from '@/types/settlement';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

interface SelectedTransaction extends DealerTransaction {
  runningBalance?: number;
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

  // إشعارات العمليات المالية
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);
  const prevTxCount = useRef<number>(transactions.length);

  // نافذة تفاصيل العملية
  const [selectedTx, setSelectedTx] = useState<SelectedTransaction | null>(null);

  // تسويات التاجر
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loadingSettlements, setLoadingSettlements] = useState(true);
  const [settlementError, setSettlementError] = useState<string | null>(null);

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

  useEffect(() => {
    if (wallet?.id) {
      fetchDealerSettlements(wallet.id);
    }
  }, [wallet?.id]);

  async function fetchDealerSettlements(walletId: string) {
    setLoadingSettlements(true);
    setSettlementError(null);
    try {
      const res = await fetch(`/api/settlements?wallet_id=${walletId}`);
      if (!res.ok) throw new Error('فشل في جلب بيانات التسويات');
      const data = await res.json();
      setSettlements(data);
    } catch (err) {
      setSettlementError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoadingSettlements(false);
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

  useEffect(() => {
    if (transactions.length > prevTxCount.current) {
      // عملية جديدة أضيفت
      const latest = transactions[0];
      setToast({
        message: `تمت عملية ${latest.type === 'credit' ? 'إيداع/إضافة' : 'سحب/خصم'} بمبلغ ${latest.amount.toLocaleString()} ريال (${latest.description || 'بدون وصف'})`,
        type: latest.type
      });
      setTimeout(() => setToast(null), 5000);
    }
    prevTxCount.current = transactions.length;
  }, [transactions]);

  // دالة توليد كشف حساب PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFont('Arial');
    doc.setFontSize(16);
    doc.text('كشف حساب العمليات المالية', 14, 16);
    doc.setFontSize(10);
    doc.text(`تاريخ التصدير: ${new Date().toLocaleString('ar-SA')}`, 14, 24);
    (doc as any).autoTable({
      startY: 30,
      head: [[
        'التاريخ',
        'نوع العملية',
        'المبلغ',
        'الرصيد بعد العملية',
        'الوصف',
      ]],
      body: filteredTransactions.map((tx) => [
        new Date(tx.created_at).toLocaleString('ar-SA'),
        tx.type === 'credit' ? 'إيداع/إضافة' : tx.type === 'debit' ? 'سحب/خصم' : tx.type,
        `${tx.amount.toLocaleString()} ريال`,
        '',
        tx.description || '-',
      ]),
      styles: { font: 'Arial', fontStyle: 'normal', fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 30 },
      margin: { left: 14, right: 14 },
      theme: 'grid',
    });
    doc.save('كشف_حساب_التاجر.pdf');
  };

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
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border rounded p-2" title="نوع العملية">
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
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className="border rounded p-2" title="من تاريخ" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-bold text-blue-900">إلى تاريخ</label>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className="border rounded p-2" title="إلى تاريخ" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-bold text-blue-900">بحث حر</label>
          <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="بحث في الوصف أو رقم العملية..." className="border rounded p-2 w-full" title="بحث حر" />
        </div>
        <button onClick={() => { setFilterType('all'); setFilterText(''); setFilterFrom(''); setFilterTo(''); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">مسح الفلاتر</button>
      </div>

      {/* إشعار Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-bold transition-all
          ${toast.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {toast.message}
        </div>
      )}

      {/* زر تحميل كشف الحساب PDF */}
      <div className="flex justify-end mb-4">
        <button onClick={handleDownloadPDF} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-bold shadow">
          تحميل كشف حساب PDF
        </button>
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
                const txs = [...filteredTransactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                return txs.map((tx, idx) => {
                  runningBalance += tx.type === 'credit' ? -tx.amount : tx.amount;
                  return (
                    <tr key={tx.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedTx({...tx, runningBalance})}>
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

      {/* نافذة تفاصيل العملية */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative animate-fadeIn">
            <button onClick={() => setSelectedTx(null)} className="absolute top-2 left-2 text-gray-500 hover:text-red-600 text-2xl">×</button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">تفاصيل العملية المالية</h3>
            <div className="space-y-2 text-right">
              <div><span className="font-bold">رقم العملية:</span> {selectedTx.id}</div>
              <div><span className="font-bold">نوع العملية:</span> {selectedTx.type === 'credit' ? 'إيداع/إضافة' : selectedTx.type === 'debit' ? 'سحب/خصم' : selectedTx.type}</div>
              <div><span className="font-bold">المبلغ:</span> {selectedTx.amount.toLocaleString()} ريال</div>
              <div><span className="font-bold">الرصيد بعد العملية:</span> {selectedTx.runningBalance?.toLocaleString() ?? '-' } ريال</div>
              <div><span className="font-bold">التاريخ والوقت:</span> {new Date(selectedTx.created_at).toLocaleString('ar-SA')}</div>
              <div><span className="font-bold">الوصف:</span> {selectedTx.description || '-'}</div>
            </div>
            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">🖨️ طباعة الإيصال</button>
              <button onClick={() => setSelectedTx(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* جدول التسويات/الدفعات */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-12">
        <h2 className="text-xl font-bold mb-4 text-blue-700">جدول التسويات / الدفعات</h2>
        {loadingSettlements ? (
          <div className="text-center py-6 text-gray-500">جاري تحميل بيانات التسويات...</div>
        ) : settlementError ? (
          <div className="text-center py-6 text-red-500">{settlementError}</div>
        ) : settlements.length === 0 ? (
          <div className="text-center py-6 text-gray-500">لا توجد تسويات أو دفعات مسجلة بعد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 border-b">رقم التسوية</th>
                  <th className="px-4 py-2 border-b">النوع</th>
                  <th className="px-4 py-2 border-b">المبلغ</th>
                  <th className="px-4 py-2 border-b">من محفظة</th>
                  <th className="px-4 py-2 border-b">إلى محفظة</th>
                  <th className="px-4 py-2 border-b">الحالة</th>
                  <th className="px-4 py-2 border-b">التاريخ</th>
                  <th className="px-4 py-2 border-b">رقم التحويل</th>
                  <th className="px-4 py-2 border-b">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-center">{s.id}</td>
                    <td className="px-4 py-2 text-center">{s.type}</td>
                    <td className="px-4 py-2 text-center">{s.amount.toLocaleString()} ريال</td>
                    <td className="px-4 py-2 text-center">{s.from_wallet.substring(0, 8)}...</td>
                    <td className="px-4 py-2 text-center">{s.to_wallet.substring(0, 8)}...</td>
                    <td className="px-4 py-2 text-center">
                      {s.status === 'completed' ? 'مكتمل' : s.status === 'pending' ? 'قيد الانتظار' : s.status === 'failed' ? 'فشل' : 'ملغي'}
                    </td>
                    <td className="px-4 py-2 text-center">{new Date(s.created_at).toLocaleString('ar-SA')}</td>
                    <td className="px-4 py-2 text-center">{s.transaction_hash || '-'}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => alert(JSON.stringify(s, null, 2))} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">عرض التفاصيل</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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