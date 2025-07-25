"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// جلب الصور من API السيارات
async function fetchCarImages(): Promise<string[]> {
  const res = await fetch("/api/cars");
  if (!res.ok) return [];
  const cars = await res.json();
  // جمع كل الصور من جميع السيارات
  const allImages: string[] = [];
  for (const car of cars) {
    if (Array.isArray(car.image_url)) {
      allImages.push(...car.image_url);
    }
  }
  return allImages;
}

export default function CarImageSlider() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchCarImages().then(setImages);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

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