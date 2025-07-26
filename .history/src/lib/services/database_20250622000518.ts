import type { Car, InstallmentPlan, FinancialSummary } from '@/types/finance';

// محاكاة قاعدة البيانات
class Database {
  private cars: Car[] = [
    {
      id: "1",
      make: 'تويوتا',
      model: 'كامري',
      year: 2024,
      price: 120000,
      imageUrl: '/images/cars/camry-2024.jpg',
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
      imageUrl: '/images/cars/sonata-2024.jpg',
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
      imageUrl: '/images/cars/k5-2024.jpg',
      color: 'رمادي',
      mileage: 0,
      fuelType: 'بنزين',
      transmission: 'أوتوماتيك',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private installmentPlans: InstallmentPlan[] = [
    {
      id: "1",
      months: 12,
      profitRate: 0.3,
      monthlyPayment: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      months: 24,
      profitRate: 0.5,
      monthlyPayment: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      months: 36,
      profitRate: 0.65,
      monthlyPayment: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private financialSummaries: FinancialSummary[] = [
    {
      id: "1",
      totalAnnualCost: 1000000,
      totalAnnualIncome: 1500000,
      salaryExpense: 200000,
      rentExpense: 100000,
      inspectionExpense: 50000,
      warrantyExpense: 75000,
      trackingExpense: 25000,
      operatingExpense: 150000,
      netProfit: 900000,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // محاكاة استعلامات قاعدة البيانات
  async findCars() {
    return [...this.cars].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findCarById(id: string) {
    return this.cars.find(car => car.id === id) || null;
  }

  async findInstallmentPlan(id: string) {
    return this.installmentPlans.find(plan => plan.id === id) || null;
  }

  async findAllInstallmentPlans() {
    return [...this.installmentPlans];
  }

  async getFinancialSummary() {
    return this.financialSummaries[0] || null;
  }

  // محاكاة إضافة سيارة جديدة
  async createCar(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCar: Car = {
      ...car,
      id: (this.cars.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cars.push(newCar);
    return newCar;
  }

  // محاكاة تحديث سيارة
  async updateCar(id: string, data: Partial<Car>) {
    const index = this.cars.findIndex(car => car.id === id);
    if (index === -1) return null;

    this.cars[index] = {
      ...this.cars[index],
      ...data,
      updatedAt: new Date()
    };
    return this.cars[index];
  }

  // محاكاة حذف سيارة
  async deleteCar(id: string) {
    const index = this.cars.findIndex(car => car.id === id);
    if (index === -1) return null;

    const deletedCar = this.cars[index];
    this.cars.splice(index, 1);
    return deletedCar;
  }
}

// إنشاء نسخة واحدة من قاعدة البيانات
export const db = new Database();

// تصدير واجهة تشبه Prisma
export const prisma = {
  car: {
    findMany: async () => db.findCars(),
    findUnique: async ({ where }: { where: { id: string } }) => db.findCarById(where.id),
    create: async ({ data }: { data: any }) => db.createCar(data),
    update: async ({ where, data }: { where: { id: string }, data: any }) => db.updateCar(where.id, data),
    delete: async ({ where }: { where: { id: string } }) => db.deleteCar(where.id)
  },
  installmentPlan: {
    findMany: async () => db.findAllInstallmentPlans(),
    findUnique: async ({ where }: { where: { id: string } }) => db.findInstallmentPlan(where.id)
  },
  financialSummary: {
    findFirst: async () => db.getFinancialSummary()
  }
};

// دوال قاعدة البيانات المؤقتة
export const executeQuery = async (query: string, values: any[] = []) => {
  console.warn("⚠️ executeQuery is a dummy function. No real database connected.");
  return { rows: [] };
};

export const pool = {
  connect: async () => ({
    release: () => {},
    query: async () => ({ rows: [] }),
  }),
}; 