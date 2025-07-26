"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// جلب الصور من API السيارات
async function fetchCarImages(): Promise<string[]> {
  try {
    const res = await fetch("/api/cars");
    if (!res.ok) {
      console.error('Failed to fetch cars:', res.status);
      return [];
    }
    const cars = await res.json();
    console.log('🚗 السيارات المستلمة:', cars);
    
    // جمع كل الصور من جميع السيارات
    const allImages: string[] = [];
    for (const car of cars) {
      // إضافة الصورة الرئيسية إذا كانت موجودة
      if (car.image_url && typeof car.image_url === 'string') {
        allImages.push(car.image_url);
      }
      // إضافة الصور من المصفوفة إذا كانت موجودة
      if (Array.isArray(car.images) && car.images.length > 0) {
        allImages.push(...car.images);
      }
    }
    
    console.log('🖼️ الصور المجمعة:', allImages);
    return allImages;
  } catch (error) {
    console.error('Error fetching car images:', error);
    return [];
  }
}

export default function CarImageSlider() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCarImages()
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (loading) {
    return (
      <div className="glass-card p-6 bg-gradient-to-br from-green-100 to-green-50 shadow-md flex items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="glass-card p-6 bg-gradient-to-br from-green-100 to-green-50 shadow-md flex items-center justify-center min-h-[350px]">
        <span className="text-gray-400 text-lg">لا توجد صور سيارات متاحة</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-0 bg-gradient-to-br from-green-100 to-green-50 shadow-md flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
      <Image
        src={images[current]}
        alt={`صورة سيارة رقم ${current + 1}`}
        width={500}
        height={320}
        className="object-contain rounded-lg max-h-[320px] transition-all duration-700"
        priority
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-3 h-3 rounded-full ${idx === current ? "bg-green-600" : "bg-green-200"}`}
          />
        ))}
      </div>
    </div>
  );
} 