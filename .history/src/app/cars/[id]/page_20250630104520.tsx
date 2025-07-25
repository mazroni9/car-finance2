/**
 * File: /app/cars/[id]/page.tsx
 *
 * ✅ Server Component
 * ✅ Arabic RTL Friendly
 * ✅ Uses CarGallery Client Component
 * ✅ Black Text Styling
 */

import { createClient } from '@/lib/supabase/server';
import CarGallery from './CarGallery';

interface Props {
  params: { id: string };
}

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

// ✅ Fetch car data from Supabase
async function getCar(id: string): Promise<Car | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('car_showcase')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Car;
}

export default async function CarDetailsPage({ params }: Props) {
  const car = await getCar(params.id);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        🚫 السيارة غير موجودة أو حدث خطأ
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-right py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6 text-center">
          {car.make} {car.model} - {car.year}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ✅ الصور (معرض) */}
          <CarGallery car={car} />

          {/* ✅ المواصفات */}
          <div className="space-y-4">
            <p className="text-2xl font-bold text-green-700">
              السعر: {car.price?.toLocaleString('ar-SA')} ريال
            </p>
            <ul className="space-y-2 text-black text-lg">
              <li>🚘 الماركة: <span className="font-bold">{car.make}</span></li>
              <li>📅 الموديل: <span className="font-bold">{car.model}</span></li>
              <li>🎨 اللون: <span className="font-bold">{car.color}</span></li>
              <li>🛣️ العداد: <span className="font-bold">{car.mileage?.toLocaleString('ar-SA')} كم</span></li>
              <li>⛽ الوقود: <span className="font-bold">{car.fuel_type}</span></li>
              <li>⚙️ القير: <span className="font-bold">{car.transmission}</span></li>
            </ul>

            {car.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded shadow-sm border">
                <h3 className="font-bold text-black mb-2">📜 الوصف</h3>
                <p className="text-black">{car.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
