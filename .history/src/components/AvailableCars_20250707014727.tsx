'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  status: string;
  images: string[];
  transmission: string;
  fuel_type: string;
}

export default function AvailableCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  async function fetchAvailableCars() {
    try {
      console.log('🔍 جاري البحث عن السيارات المتاحة...');
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available');

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

  async function handlePurchase(carId: string) {
    // سيتم تنفيذ عملية الشراء هنا
    console.log('جاري شراء السيارة:', carId);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* صورة السيارة */}
            <div className="h-48 bg-gray-200">
              {car.images && car.images[0] ? (
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  🚗 لا تتوفر صورة
                </div>
              )}
            </div>

            {/* تفاصيل السيارة */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-center mb-2 text-black">
                {car.brand} {car.model}
              </h3>
              <div className="text-lg font-bold text-center text-green-600 mb-4">
                {car.price.toLocaleString('ar-SA')} ريال
              </div>

              <div className="space-y-2 text-right">
                <div className="flex justify-between items-center text-black">
                  <span>🎨 اللون: {car.color}</span>
                  <span>📅 الموديل: {car.year}</span>
                </div>
                <div className="flex justify-between items-center text-black">
                  <span>⚙️ الناقل: {car.transmission || 'أوتوماتيك'}</span>
                  <span>⛽ الوقود: {car.fuel_type || 'بنزين'}</span>
                </div>
                <div className="flex justify-between items-center text-black">
                  <span>🛣️ الممشى: {car.mileage.toLocaleString('ar-SA')} كم</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(car.id)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                شراء 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 