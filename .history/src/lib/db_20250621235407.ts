// import { PrismaClient } from '@prisma/client'

// Temporary mock Prisma client
export const prisma = {
  car: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  }
};

// نموذج بيانات السيارة
export interface CarData {
  priceCategory: number;
  quantity: number;
  downPaymentRate: number;
  installmentPlanId: number;
  inspectionCost: number;
  warrantyCost: number;
  trackingCost: number;
}

// نموذج خطة التقسيط
export interface InstallmentPlan {
  id: number;
  months: number;
  profitRate: number;
}

// نتيجة الحسابات المالية
export interface FinancialCalculation {
  downPayment: number;
  sellingPrice: number;
  monthlyPayment: number;
  monthlyIncome: number;
  annualIncome: number;
}

// دالة التحقق من صحة بيانات السيارة
export function validateCarData(data: CarData) {
  const errors: string[] = [];

  if (!data.priceCategory || data.priceCategory <= 0) {
    errors.push('الفئة السعرية غير صحيحة');
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.push('عدد السيارات غير صحيح');
  }

  if (!data.downPaymentRate || data.downPaymentRate < 0.1 || data.downPaymentRate > 0.5) {
    errors.push('نسبة الدفعة الأولى غير صحيحة');
  }

  if (!data.installmentPlanId) {
    errors.push('خطة التقسيط غير محددة');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// دالة حساب التمويل
export function calculateFinancials(carData: CarData, installmentPlan: InstallmentPlan): FinancialCalculation {
  const downPayment = Math.round(carData.priceCategory * carData.downPaymentRate);
  const sellingPrice = Math.round(carData.priceCategory * (1 + installmentPlan.profitRate));
  const monthlyPayment = Math.round((sellingPrice - downPayment * 2) / installmentPlan.months);

  return {
    downPayment,
    sellingPrice,
    monthlyPayment,
    monthlyIncome: monthlyPayment * carData.quantity,
    annualIncome: monthlyPayment * carData.quantity * 12,
  };
}

// نموذج بيانات السيارة في المعرض
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  color: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  createdAt: Date;
  updatedAt: Date;
}

// قاعدة بيانات مؤقتة للسيارات
const cars: Car[] = [
  {
    id: "1",
    make: 'تويوتا',
    model: 'كامري',
    year: 2024,
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    color: 'أبيض',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    make: 'هونداي',
    model: 'سوناتا',
    year: 2024,
    price: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800',
    color: 'أسود',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    make: 'كيا',
    model: 'K5',
    year: 2024,
    price: 100000,
    imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    color: 'رمادي',
    mileage: 0,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// واجهة قاعدة البيانات المؤقتة
export const db = {
  cars: {
    findMany: async () => cars,
    findUnique: async (id: string) => cars.find(car => car.id === id),
    create: async (data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newCar: Car = {
        ...data,
        id: (cars.length + 1).toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      cars.push(newCar);
      return newCar;
    },
    update: async (id: string, data: Partial<Car>) => {
      const index = cars.findIndex(car => car.id === id);
      if (index === -1) return null;
      cars[index] = { ...cars[index], ...data, updatedAt: new Date() };
      return cars[index];
    },
    delete: async (id: string) => {
      const index = cars.findIndex(car => car.id === id);
      if (index === -1) return null;
      const deleted = cars.splice(index, 1)[0];
      return deleted;
    }
  }
};
