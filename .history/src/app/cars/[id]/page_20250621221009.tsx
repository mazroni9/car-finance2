import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Car } from '@/types/finance';

async function getCar(id: string): Promise<Car> {
  // Mock data for a single car
  const mockCar: Car = {
    id: id,
    make: 'تويوتا',
    model: 'كامري',
    year: 2024,
    price: 120000,
    imageUrl: '/images/cars/camry-2024.jpg',
    color: 'أبيض',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return mockCar;
}

interface CarPageProps {
  params: {
    id: string;
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const car = await getCar(params.id);

  return (
    <div className="space-y-8">
      <div className="glass-card">
        <div className="relative h-96 w-full">
          <Image
            src={car.imageUrl || '/images/cars/default-car.jpg'}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">{car.make} {car.model}</h1>
              <p className="text-xl mt-2">{car.year}</p>
            </div>
            <p className="text-3xl font-bold text-green-500">
              {car.price.toLocaleString('ar-SA')} ريال
            </p>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">مواصفات السيارة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <p className="text-lg">اللون: {car.color}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-lg">عدد الكيلومترات: {car.mileage.toLocaleString('ar-SA')} كم</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-lg">نوع الوقود: {car.fuelType}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-lg">نوع ناقل الحركة: {car.transmission}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link 
              href={`/finance?carId=${car.id}`}
              className="button-primary text-lg px-8 py-3"
            >
              احسب التمويل
            </Link>
            <Link 
              href="/cars"
              className="button-secondary text-lg px-8 py-3"
            >
              عودة للمعرض
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 