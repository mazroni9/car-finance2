export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  images: CarImage[];
  created_at: string;
  updated_at: string;
} 