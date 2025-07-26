import Image from 'next/image';
import Link from 'next/link';
import { BuyButton } from './BuyButton';

interface CarCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    description: string;
    images: { url: string; is_primary: boolean }[];
  };
}

export function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images.find(img => img.is_primary) || car.images[0];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={primaryImage?.url || '/images/car-placeholder.jpg'}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">
          {car.make} {car.model} {car.year}
        </h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{car.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">{car.price.toLocaleString()} ريال</span>
          <div className="space-x-2 rtl:space-x-reverse">
            <Link
              href={`/cars/${car.id}`}
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              التفاصيل
            </Link>
            <BuyButton carId={car.id} price={car.price} />
          </div>
        </div>
      </div>
    </div>
  );
} 