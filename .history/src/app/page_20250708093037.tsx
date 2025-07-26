'use client';

import CarEntryForm from '@/components/CarEntryForm';
import CarImageSlider from '@/components/CarImageSlider';

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-screen bg-gray-100 p-8">
      {/* نموذج إدخال السيارة */}
      <div className="flex-1 flex items-center justify-center">
        <CarEntryForm />
      </div>
      {/* سلايدر الصور */}
      <div className="flex-1 flex items-center justify-center">
        <CarImageSlider />
      </div>
    </div>
  );
}
