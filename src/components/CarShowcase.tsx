'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface Car {
  id: number;
  name: string;
  price: number;
  image: string;
  created_at?: string;
}

export default function CarShowcase() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from('car_showcase')
        .select('id, name, price, image, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars:', error);
      } else {
        setCars(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">🚗 لا توجد سيارات متاحة حالياً</p>
        <button
          onClick={fetchCars}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          تحديث
        </button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">
          🚘 سيارات متاحة للتمويل
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all shadow-lg"
          >
            <div className="relative h-48 mb-4">
              <img
                src={car.image || '/placeholder.png'}
                alt={`صورة سيارة ${car.name}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{car.name}</h3>
            <p className="text-lg font-semibold text-gray-700">
              {car.price.toLocaleString()} ريال
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
