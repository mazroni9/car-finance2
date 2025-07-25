/**
 * File: /app/cars/page.tsx
 * ✅ Server Component
 * ✅ Arabic RTL friendly
 * ✅ واضح جدًا، أسود قوي، منسق
 */

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string[];
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
}

async function getCars(): Promise<Car[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('car_showcase')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data as Car[];
}

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">
            🚗 معرض السيارات
          </h1>
          <p className="text-lg text-black font-medium">
            تصفح مجموعتنا المختارة من السيارات المتاحة للتمويل
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="block rounded-2xl overflow-hidden border shadow-md hover:shadow-xl bg-white transition-all duration-300"
            >
              <div className="relative w-full h-56 bg-gray-100">
                {car.image_url && car.image_url.length > 0 ? (
                  <Image
                    src={car.image_url[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black font-bold text-lg">
                    لا توجد صورة
                  </div>
                )}
              </div>

              <div className="p-5 text-right space-y-3">
                <h2 className="text-2xl font-extrabold text-black">
                  {car.make} {car.model}
                </h2>
                <p className="text-lg text-black font-medium">{car.year}</p>
                <p className="text-green-700 text-xl font-bold">
                  {car.price.toLocaleString('ar-SA')} ريال
                </p>
                <div className="text-base text-black space-y-1 font-medium">
                  <p>🚗 اللون: {car.color}</p>
                  <p>⛽ الوقود: {car.fuel_type} - ⚙️ القير: {car.transmission}</p>
                  <p>🛣️ كم : {car.mileage.toLocaleString('ar-SA')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
