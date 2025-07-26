'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';

interface CarDetails {
  id: string;
  make: string;
  model: string;
  price: number;
  seller_id: string; // معرف البائع
  showroom_id: string; // معرف المعرض
}

interface WalletInfo {
  id: string;
  balance: number;
}

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<CarDetails | null>(null);
  const [buyerWallet, setBuyerWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      // 1. جلب معلومات المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. جلب تفاصيل السيارة
      const { data: carData, error: carError } = await supabase
        .from('car_showcase')
        .select('*, showroom:showroom_id(*)')
        .eq('id', params.id)
        .single();

      if (carError) throw carError;

      // 3. جلب معلومات محفظة المشتري
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;

      setCar(carData);
      setBuyerWallet(walletData);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      alert('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase() {
    if (!car || !buyerWallet) return;
    
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول');

      // حساب العمولات
      const platformFee = car.price * 0.02; // 2% عمولة المنصة
      const showroomFee = car.price * 0.01; // 1% عمولة المعرض
      const totalAmount = car.price + platformFee + showroomFee;

      // التحقق من كفاية الرصيد
      if (buyerWallet.balance < totalAmount) {
        throw new Error('رصيد المحفظة غير كافي');
      }

      // بدء المعاملة
      // 1. إنشاء معاملة الشراء
      const { data: transaction, error: transactionError } = await supabase
        .from('showroom_transactions')
        .insert({
          car_id: car.id,
          buyer_id: user.id,
          seller_id: car.seller_id,
          showroom_id: car.showroom_id,
          amount: car.price,
          platform_fee: platformFee,
          showroom_fee: showroomFee,
          type: 'purchase',
          status: 'completed'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // 2. تحديث محفظة المشتري (خصم المبلغ الإجمالي)
      const { error: buyerWalletError } = await supabase
        .from('wallets')
        .update({ balance: buyerWallet.balance - totalAmount })
        .eq('user_id', user.id);

      if (buyerWalletError) throw buyerWalletError;

      // 3. تحديث محفظة البائع (إضافة سعر السيارة)
      const { error: sellerWalletError } = await supabase
        .from('wallets')
        .update({ 
          balance: supabase.raw('balance + ?', [car.price])
        })
        .eq('user_id', car.seller_id);

      if (sellerWalletError) throw sellerWalletError;

      // 4. تحديث محفظة المنصة (إضافة العمولة)
      const { error: platformWalletError } = await supabase
        .from('platform_wallet')
        .update({ 
          balance: supabase.raw('balance + ?', [platformFee])
        })
        .eq('id', 1); // محفظة المنصة الرئيسية

      if (platformWalletError) throw platformWalletError;

      // 5. تحديث محفظة المعرض (إضافة العمولة)
      const { error: showroomWalletError } = await supabase
        .from('showroom_wallets')
        .update({ 
          balance: supabase.raw('balance + ?', [showroomFee])
        })
        .eq('showroom_id', car.showroom_id);

      if (showroomWalletError) throw showroomWalletError;

      // 6. تحديث حالة السيارة
      const { error: carUpdateError } = await supabase
        .from('car_showcase')
        .update({ 
          owner_id: user.id,
          status: 'sold'
        })
        .eq('id', car.id);

      if (carUpdateError) throw carUpdateError;

      // نجاح العملية
      router.push('/dealer/dashboard?purchase=success');
      
    } catch (error: any) {
      console.error('خطأ في عملية الشراء:', error);
      alert(error.message || 'حدث خطأ أثناء عملية الشراء');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!car || !buyerWallet) {
    return (
      <div className="text-center py-8 text-red-500">
        لم يتم العثور على بيانات السيارة أو المحفظة
      </div>
    );
  }

  const platformFee = car.price * 0.02;
  const showroomFee = car.price * 0.01;
  const totalAmount = car.price + platformFee + showroomFee;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">تأكيد شراء السيارة</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl mb-4 text-black">{car.make} {car.model}</h2>
        
        <div className="space-y-4 text-black">
          <div className="flex justify-between items-center border-b pb-2">
            <span>سعر السيارة:</span>
            <span className="font-bold">{car.price.toLocaleString('ar-SA')} ريال</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span>عمولة المنصة (2%):</span>
            <span>{platformFee.toLocaleString('ar-SA')} ريال</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span>عمولة المعرض (1%):</span>
            <span>{showroomFee.toLocaleString('ar-SA')} ريال</span>
          </div>

          <div className="flex justify-between items-center pt-2 text-lg font-bold">
            <span>المبلغ الإجمالي:</span>
            <span>{totalAmount.toLocaleString('ar-SA')} ريال</span>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span>رصيد محفظتك:</span>
              <span className={buyerWallet.balance < totalAmount ? 'text-red-500' : 'text-green-600'}>
                {buyerWallet.balance.toLocaleString('ar-SA')} ريال
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={processing || buyerWallet.balance < totalAmount}
          className={`
            w-full mt-6 py-3 px-4 rounded-lg text-white font-bold
            ${processing || buyerWallet.balance < totalAmount
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 transition-colors'
            }
          `}
        >
          {processing 
            ? '... جاري إتمام عملية الشراء'
            : buyerWallet.balance < totalAmount
              ? 'رصيد المحفظة غير كافي'
              : 'تأكيد الشراء'
          }
        </button>
      </div>
    </div>
  );
} 