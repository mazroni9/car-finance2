"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CarImageSlider() {

  // قائمة الصور الثابتة من مجلد public/images/slider
  const images = [
    "/images/slider/photo-1552519507-da3b142c6e3d.webp",
    "/images/slider/mercedes-gle.jpeg",
    "/images/slider/lucury-4.jpg",
    "/images/slider/lucury-3.jpg",
    "/images/slider/lucury-2.jpg",
    "/images/slider/lucury-1.jpg",
    "/images/slider/lexus-rx-350.jpg",
    "/images/slider/bmw-5series.jpeg",
    "/images/slider/classic-1.jpg",
    "/images/slider/audi-q7.webp",
    "/images/slider/audi-q7.jpeg",
    "/images/slider/Picture5.png",
    "/images/slider/Picture4.png",
    "/images/slider/Picture2.jpg",
    "/images/slider/Picture1.png",
    "/images/slider/GoVVLqqXMAAURyo.jpg",
    "/images/slider/F3zfbefWUAAi1AK.jpg",
    "/images/slider/F3zfbelXsAUWoIc.jpg",
    "/images/slider/DBqBHHvWAAQukuZ.jpg",
    "/images/slider/F3zfbeeW8AAGHTk.jpg",
    "/images/slider/DBqBHHmW0AA1JQZ.jpg",
    "/images/slider/1970 Plum Crazy Dodge Dart Swinger.jpg",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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