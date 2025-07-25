/**
 * File: /app/cars/page.tsx
 * ✅ Arabic RTL friendly
 * ✅ Buy Button added
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
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>العودة للرئيسية</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">
            🚗 معرض السيارات
          </h1>
          <p className="text-lg text-black font-medium">
            تصفح مجموعتنا المختارة من السيارات المتاحة للتمويل
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col rounded-xl overflow-hidden border shadow-md hover:shadow-xl bg-white transition-all duration-300"
            >
              <Link
                href={`/cars/${car.id}`}
                className="relative w-full h-40 bg-gray-100"
              >
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
              </Link>

              <div className="p-4 text-right space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-black">
                    {car.make} {car.model}
                  </h2>
                  <p className="text-base text-black font-medium">{car.year}</p>
                  <p className="text-green-700 text-lg font-bold">
                    {car.price.toLocaleString('ar-SA')} ريال
                  </p>
                  <div className="text-sm text-black space-y-1 font-medium">
                    <p>🚗 اللون: {car.color}</p>
                    <p>⛽ الوقود: {car.fuel_type} - ⚙️ القير: {car.transmission}</p>
                    <p>🛣️ كم : {car.mileage.toLocaleString('ar-SA')}</p>
                  </div>
                </div>

                {/* زر الشراء */}
                <button
                  disabled
                  className="w-full mt-2 py-2 px-4 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  title="هذه الميزة ستفعل لاحقًا"
                >
                  ✅ شراء
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
