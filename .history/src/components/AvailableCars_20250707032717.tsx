'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  status: string;
  transmission: string;
  fuel_type: string;
  created_at: string;
}

export default function AvailableCars() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPurchase, setProcessingPurchase] = useState<number | null>(null);

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  async function fetchAvailableCars() {
    try {
      console.log('🔍 جاري البحث عن السيارات المتاحة...');
      const { data, error } = await supabase
        .from('car_showcase')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في جلب السيارات:', error.message);
        setError(error.message);
        return;
      }

      console.log('✅ تم العثور على السيارات:', data);
      setCars(data || []);
    } catch (err) {
      console.error('❌ خطأ غير متوقع:', err);
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(carId: number) {
    try {
      setProcessingPurchase(carId);
      
      // توجيه المستخدم إلى صفحة إتمام عملية الشراء
      router.push(`/dealer/purchase/${carId}`);
    } catch (err) {
      console.error('❌ خطأ في عملية الشراء:', err);
      setError('حدث خطأ أثناء عملية الشراء');
    } finally {
      setProcessingPurchase(null);
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-black">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">❌ {error}</div>;
  }

  if (cars.length === 0) {
    return <div className="text-center py-4 text-black">لا توجد سيارات متاحة للشراء حالياً</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-6 text-black">🚗 السيارات المتاحة للشراء</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-right text-black">الماركة</th>
              <th className="px-4 py-2 text-right text-black">الموديل</th>
              <th className="px-4 py-2 text-right text-black">السنة</th>
              <th className="px-4 py-2 text-right text-black">السعر</th>
              <th className="px-4 py-2 text-right text-black">اللون</th>
              <th className="px-4 py-2 text-right text-black">الممشى</th>
              <th className="px-4 py-2 text-right text-black">ناقل الحركة</th>
              <th className="px-4 py-2 text-right text-black">نوع الوقود</th>
              <th className="px-4 py-2 text-right text-black">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-black">{car.brand}</td>
                <td className="px-4 py-2 text-black">{car.model}</td>
                <td className="px-4 py-2 text-black">{car.year}</td>
                <td className="px-4 py-2 text-black font-semibold text-green-600">
                  {car.price.toLocaleString('ar-SA')} ريال
                </td>
                <td className="px-4 py-2 text-black">{car.color}</td>
                <td className="px-4 py-2 text-black">{car.mileage.toLocaleString('ar-SA')} كم</td>
                <td className="px-4 py-2 text-black">{car.transmission || 'أوتوماتيك'}</td>
                <td className="px-4 py-2 text-black">{car.fuel_type || 'بنزين'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handlePurchase(car.id)}
                    disabled={processingPurchase === car.id}
                    className={`
                      px-4 py-1 rounded transition-colors
                      ${processingPurchase === car.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    {processingPurchase === car.id ? '... جاري الشراء' : '🛒 شراء'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 