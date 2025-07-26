'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function AvailableCars() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPurchase, setProcessingPurchase] = useState<string | null>(null);

  useEffect(() => {
    // استخدام نفس البيانات المضافة في صفحة معرض السيارات
    const additionalCars: Car[] = [
      // الصف الأول - سيارات فاخرة
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
      },
      {
        id: 'luxury-5',
        make: 'فورد',
        model: 'اكسبدشن',
        year: 2019,
        price: 30000,
        image_url: ['/images/cars/فورد اكسبدشن-1.jpg'],
        color: 'أزرق',
        mileage: 300000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'SUV كبير وعائلي'
      },
      
      // الصف الثاني - سيارات كلاسيكية
      {
        id: 'classic-1',
        make: 'دودج',
        model: 'Dart Swinger',
        year: 1970,
        price: 220000,
        image_url: ['/images/cars/1970 Plum Crazy Dodge Dart Swinger.jpg'],
        color: 'بنفسجي',
        mileage: 150000,
        fuel_type: 'بنزين',
        transmission: 'يدوي',
        description: 'سيارة كلاسيكية نادرة'
      },
      {
        id: 'classic-2',
        make: 'كلاسيك',
        model: 'Vintage',
        year: 1985,
        price: 235000,
        image_url: ['/images/cars/classic-1.jpg'],
        color: 'أحمر',
        mileage: 89000,
        fuel_type: 'بنزين',
        transmission: 'يدوي',
        description: 'سيارة كلاسيكية محفوظة'
      },
      {
        id: 'classic-3',
        make: 'فورد',
        model: 'كلاسيك',
        year: 1990,
        price: 245000,
        image_url: ['/images/cars/Picture1.png'],
        color: 'أزرق',
        mileage: 120000,
        fuel_type: 'بنزين',
        transmission: 'يدوي',
        description: 'سيارة كلاسيكية أنيقة'
      },
      {
        id: 'classic-4',
        make: 'شيفروليه',
        model: 'كلاسيك',
        year: 1988,
        price: 230000,
        image_url: ['/images/cars/Picture2.jpg'],
        color: 'أصفر',
        mileage: 95000,
        fuel_type: 'بنزين',
        transmission: 'يدوي',
        description: 'سيارة كلاسيكية مميزة'
      },
      {
        id: 'classic-5',
        make: 'بونتياك',
        model: 'كلاسيك',
        year: 1987,
        price: 240000,
        image_url: ['/images/cars/Picture3.png'],
        color: 'أخضر',
        mileage: 110000,
        fuel_type: 'بنزين',
        transmission: 'يدوي',
        description: 'سيارة كلاسيكية فريدة'
      },
      
      // الصف الثالث - سيارات رياضية
      {
        id: 'sport-1',
        make: 'شيفروليه',
        model: 'كامارو',
        year: 2020,
        price: 290000,
        image_url: ['/images/cars/photo-1552519507-da3b142c6e3d.webp'],
        color: 'أزرق',
        mileage: 35000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة رياضية قوية'
      },
      {
        id: 'sport-2',
        make: 'فورد',
        model: 'موستانج',
        year: 2019,
        price: 275000,
        image_url: ['/images/cars/GoVVLqqXMAAURyo.jpg'],
        color: 'أحمر',
        mileage: 42000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة رياضية أمريكية'
      },
      {
        id: 'sport-3',
        make: 'دودج',
        model: 'تشارجر',
        year: 2021,
        price: 285000,
        image_url: ['/images/cars/F3zfbefWUAAi1AK.jpg'],
        color: 'أسود',
        mileage: 28000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة رياضية قوية'
      },
      {
        id: 'sport-4',
        make: 'شيفروليه',
        model: 'كورفيت',
        year: 2020,
        price: 295000,
        image_url: ['/images/cars/F3zfbelXsAUWoIc.jpg'],
        color: 'أصفر',
        mileage: 32000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة رياضية خارقة'
      },
      {
        id: 'sport-5',
        make: 'بونتياك',
        model: 'فايربيرد',
        year: 2019,
        price: 265000,
        image_url: ['/images/cars/DBqBHHvWAAQukuZ.jpg'],
        color: 'أبيض',
        mileage: 45000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة رياضية كلاسيكية'
      },
      
      // الصف الرابع - سيارات عائلية
      {
        id: 'family-1',
        make: 'فورد',
        model: 'اكسبلورر',
        year: 2020,
        price: 250000,
        image_url: ['/images/cars/F3zfbeeW8AAGHTk.jpg'],
        color: 'رمادي',
        mileage: 38000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة عائلية مريحة'
      },
      {
        id: 'family-2',
        make: 'شيفروليه',
        model: 'تاهو',
        year: 2019,
        price: 260000,
        image_url: ['/images/cars/DBqBHHmW0AA1JQZ.jpg'],
        color: 'أزرق',
        mileage: 42000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'SUV عائلي كبير'
      },
      {
        id: 'family-3',
        make: 'GMC',
        model: 'يوكون',
        year: 2021,
        price: 270000,
        image_url: ['/images/cars/DBqBHH2W0AAtXpd.jpg'],
        color: 'أبيض',
        mileage: 25000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة عائلية فاخرة'
      },
      {
        id: 'family-5',
        make: 'جيب',
        model: 'جراند شيروكي',
        year: 2019,
        price: 245000,
        image_url: ['/images/cars/FQ3STh2WQAI5cXF.jpg'],
        color: 'أحمر',
        mileage: 48000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        description: 'سيارة عائلية قوية'
      }
    ];

    setCars(additionalCars);
    setLoading(false);
  }, []);

  async function handlePurchase(carId: string) {
    try {
      setProcessingPurchase(carId);
      // توجيه المستخدم إلى صفحة تفاصيل السيارة بدلاً من صفحة الشراء الخاصة بالتاجر
      router.push(`/cars/${carId}`);
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
      <h2 className="text-xl font-bold mb-6 text-blue-700">🚗 السيارات المتاحة للشراء</h2>
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
                <td className="px-4 py-2 text-black">{car.make}</td>
                <td className="px-4 py-2 text-black">{car.model}</td>
                <td className="px-4 py-2 text-black">{car.year}</td>
                <td className="px-4 py-2 text-black font-semibold text-green-600">
                  {car.price.toLocaleString('ar-SA')} ريال
                </td>
                <td className="px-4 py-2 text-black">{car.color}</td>
                <td className="px-4 py-2 text-black">{car.mileage.toLocaleString('ar-SA')} كم</td>
                <td className="px-4 py-2 text-black">{car.transmission}</td>
                <td className="px-4 py-2 text-black">{car.fuel_type}</td>
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