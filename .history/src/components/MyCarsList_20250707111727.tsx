'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import SellButton from './SellButton';
import Image from 'next/image';

interface MyCar {
  id: string;
  car_id: string;
  acquired_at: string;
  price: number;
  car_details: {
    make: string;
    model: string;
    year: number;
    image_url: string[];
    color: string;
    mileage: number;
    fuel_type: string;
    transmission: string;
  };
}

export default function MyCarsList() {
  const [myCars, setMyCars] = useState<MyCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCars();
  }, []);

  async function fetchMyCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dealer_cars')
      .select(`
        id,
        car_id,
        acquired_at,
        price,
        car_details:cars (
          make,
          model,
          year,
          image_url,
          color,
          mileage,
          fuel_type,
          transmission
        )
      `)
      .order('acquired_at', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب سيارات التاجر:', error);
      setMyCars([]);
    } else {
      setMyCars(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        ⏳ جاري تحميل سياراتك...
      </div>
    );
  }

  if (myCars.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        🚗 لا تملك أي سيارات حاليًا
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">🚀 سياراتك المملوكة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {myCars.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {item.car_details?.image_url?.[0] && item.car_details.image_url[0].startsWith('/') ? (
                  <Image
                    src={item.car_details.image_url[0]}
                    alt={`${item.car_details.make} ${item.car_details.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black font-bold">
                    لا توجد صورة
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-black mb-2">
                {item.car_details.make} {item.car_details.model}
              </h3>
              <p className="text-gray-800 mb-1">🚗 اللون: {item.car_details.color}</p>
              <p className="text-gray-800 mb-1">🛣️ كم: {item.car_details.mileage.toLocaleString()}</p>
              <p className="text-gray-800 mb-1">
                ⛽ {item.car_details.fuel_type} - ⚙️ {item.car_details.transmission}
              </p>
              <p className="text-green-700 font-bold mt-2">
                السعر عند الشراء: {item.price.toLocaleString()} ريال
              </p>
            </div>

            <SellButton onSell={fetchMyCars} />
          </div>
        ))}
      </div>
    </div>
  );
}
