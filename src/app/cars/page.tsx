import Link from 'next/link';
import Image from 'next/image';
import type { Car } from '@/types/finance';

// Temporary mock data
const mockCars: Car[] = [
  {
    id: "1",
    make: 'تويوتا',
    model: 'كامري',
    year: 2024,
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    color: 'أبيض',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    make: 'هونداي',
    model: 'سوناتا',
    year: 2024,
    price: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800',
    color: 'أسود',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    make: 'كيا',
    model: 'K5',
    year: 2024,
    price: 100000,
    imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    color: 'رمادي',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function getCars(): Promise<Car[]> {
  return mockCars;
}

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 bg-gradient-to-br from-blue-50 to-white shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4">معرض السيارات</h1>
        <p className="text-xl opacity-90">
          تصفح مجموعتنا المميزة من السيارات المتاحة للتمويل
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Link 
            href={`/cars/${car.id}`} 
            key={car.id}
            className="glass-card hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-md hover:shadow-lg"
          >
            <div className="relative h-48 w-full">
              <Image
                src={car.imageUrl || '/images/cars/default-car.jpg'}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4 bg-gradient-to-t from-white to-transparent">
              <h2 className="text-xl font-bold text-blue-900">{car.make} {car.model}</h2>
              <p className="text-lg mt-2 text-blue-800">{car.year}</p>
              <p className="text-lg font-bold mt-2 text-green-600">
                {car.price.toLocaleString('ar-SA')} ريال
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 