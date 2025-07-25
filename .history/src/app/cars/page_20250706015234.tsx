/**
 * File: /app/cars/page.tsx
 * ✅ Server Component
 * ✅ Arabic RTL friendly
 * ✅ واضح جدًا، أسود قوي، منسق
 */

'use client';

import { useEffect, useState } from 'react';
import { CarCard } from '@/components/CarCard';
import type { Car } from '@/types/car';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) throw new Error('فشل في جلب السيارات');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">معرض السيارات</h1>
      
      {cars.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">لا توجد سيارات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
