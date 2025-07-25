/**
 * File: /app/cars/[id]/CarGallery.tsx
 * ✅ Client Component
 * ✅ Gallery with main image + thumbnails
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CarGallery({ car }: { car: any }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen bg-white text-right py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6 text-center">
          {car.make} {car.model} - {car.year}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {Array.isArray(car.image_url) && car.image_url.length > 0 && car.image_url.every((url: string) => url && url.startsWith('/')) ? (
              <>
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow border mb-4">
                  <Image
                    src={car.image_url[selected]}
                    alt={`${car.make} ${car.model} - صورة ${selected + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex space-x-2 overflow-x-auto">
                  {car.image_url.map((url: string, idx: number) => (
                    <button
                      key={idx}
                      className={`relative w-24 h-24 rounded overflow-hidden border-2 ${
                        selected === idx ? 'border-blue-600' : 'border-gray-200'
                      }`}
                      onClick={() => setSelected(idx)}
                      title={`صورة ${idx + 1}`}
                    >
                      <Image
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-10 bg-gray-100 rounded text-center text-gray-500">
                لا توجد صور متاحة
              </div>
            )}
          </div>

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
