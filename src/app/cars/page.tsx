/**
 * File: /app/cars/page.tsx
 * ✅ Arabic RTL friendly
 * ✅ Buy Button added
 * ✅ Error handling improved
 */

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import BuyButton from '@/components/BuyButton';

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
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('car_showcase')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

// بيانات السيارات الافتراضية
const defaultCars: Car[] = [
  {
    id: 'luxury-1',
    make: 'مرسيدس',
    model: 'GLE',
    year: 2020,
    price: 280000,
    image_url: ['/images/cars/mercedes-gle.jpeg'],
    color: 'أبيض',
    mileage: 45000,
    fuel_type: 'بنزين',
    transmission: 'أوتوماتيك',
    description: 'سيارة فاخرة بحالة ممتازة'
  },
  {
    id: 'luxury-2',
    make: 'BMW',
    model: '5 Series',
    year: 2019,
    price: 265000,
    image_url: ['/images/cars/bmw-5series.jpeg'],
    color: 'أسود',
    mileage: 52000,
    fuel_type: 'بنزين',
    transmission: 'أوتوماتيك',
    description: 'سيارة رياضية أنيقة'
  },
  {
    id: 'luxury-3',
    make: 'أودي',
    model: 'Q7',
    year: 2021,
    price: 295000,
    image_url: ['/images/cars/audi-q7.webp'],
    color: 'رمادي',
    mileage: 38000,
    fuel_type: 'بنزين',
    transmission: 'أوتوماتيك',
    description: 'SUV فاخر ومريح'
  },
  {
    id: 'luxury-4',
    make: 'لكزس',
    model: 'RX 350',
    year: 2020,
    price: 275000,
    image_url: ['/images/cars/lexus-rx-350.jpg'],
    color: 'أبيض',
    mileage: 42000,
    fuel_type: 'بنزين',
    transmission: 'أوتوماتيك',
    description: 'سيارة فاخرة موثوقة'
  }
];

export default async function CarsPage() {
  let cars: Car[] = [];
  
  try {
    // محاولة جلب السيارات من قاعدة البيانات
    const dbCars = await getCars();
    cars = dbCars.length > 0 ? dbCars : defaultCars;
  } catch (error) {
    console.error('Error in CarsPage:', error);
    cars = defaultCars;
  }

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
            🚗 معرض محمد أحمد الزهراني وإخوانه
          </h1>
          <p className="text-lg text-black font-medium">
            تصفح مجموعتنا المختارة من السيارات المستعملة للبيع نقداً وعبر نظام التأجير والبيع بالتقسيط وأنظمة تمويلية مخصصة للتجار
          </p>
        </div>

        {/* خانة عدد السيارات */}
        <div className="text-center mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">
            عدد السيارات المعروضة حالياً: {cars.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col rounded-xl overflow-hidden border shadow-md hover:shadow-xl bg-white transition-all duration-300"
            >
              <Link
                href={`/cars/${car.id}`}
                className="relative w-full h-40 bg-gray-100"
              >
                {car.image_url && Array.isArray(car.image_url) && car.image_url.length > 0 && car.image_url[0] ? (
                  <Image
                    src={car.image_url[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black font-bold text-lg">
                    🚗
                  </div>
                )}
              </Link>

              <div className="p-6 space-y-4">
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
                <BuyButton carId={car.id} price={car.price} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
