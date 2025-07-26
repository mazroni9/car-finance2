import { supabase } from './supabaseClient';

interface CarData {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  images: string[];
}

export async function createCar(carData: CarData) {
  // إنشاء السيارة
  const { data: car, error: carError } = await supabase
    .from('cars')
    .insert({
      make: carData.make,
      model: carData.model,
      year: carData.year,
      price: carData.price,
      description: carData.description,
    })
    .select()
    .single();

  if (carError) {
    throw new Error('فشل في إنشاء السيارة');
  }

  // إضافة الصور
  if (carData.images.length > 0) {
    const images = carData.images.map((url, index) => ({
      car_id: car.id,
      url,
      is_primary: index === 0,
    }));

    const { error: imagesError } = await supabase
      .from('car_images')
      .insert(images);

    if (imagesError) {
      throw new Error('فشل في إضافة صور السيارة');
    }
  }

  return car;
} 