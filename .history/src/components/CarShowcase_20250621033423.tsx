'use client';

interface CarShowcaseProps {
  cars: {
    id: number;
    name: string;
    price: number;
    image: string;
  }[];
}

export default function CarShowcase({ cars }: CarShowcaseProps) {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[var(--text-primary)]">
          سيارات متاحة للتمويل
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all"
          >
            <div className="relative h-48 mb-4">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{car.name}</h3>
            <p className="text-lg font-semibold text-[var(--text-secondary)]">
              {car.price.toLocaleString()} ريال
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 