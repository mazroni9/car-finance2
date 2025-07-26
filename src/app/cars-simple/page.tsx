export default function CarsSimplePage() {
  const cars = [
    {
      id: '1',
      make: 'تويوتا',
      model: 'كامري',
      year: 2020,
      price: 120000,
      color: 'أبيض',
      mileage: 50000,
      fuel_type: 'بنزين',
      transmission: 'أوتوماتيك',
      description: 'سيارة ممتازة'
    },
    {
      id: '2',
      make: 'هونداي',
      model: 'سوناتا',
      year: 2019,
      price: 110000,
      color: 'أسود',
      mileage: 60000,
      fuel_type: 'بنزين',
      transmission: 'أوتوماتيك',
      description: 'سيارة أنيقة'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">
            🚗 معرض محمد أحمد الزهراني وإخوانه
          </h1>
          <p className="text-lg text-black font-medium">
            تصفح مجموعتنا المختارة من السيارات المستعملة
          </p>
        </div>

        <div className="text-center mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">
            عدد السيارات المعروضة حالياً: {cars.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🚗</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-black">
                  {car.make} {car.model}
                </h2>
                <p className="text-base text-black font-medium">{car.year}</p>
                <p className="text-green-700 text-lg font-bold">
                  {car.price.toLocaleString('ar-SA')} ريال
                </p>
                <div className="text-sm text-black space-y-1 font-medium">
                  <p>🚗 اللون: {car.color}</p>
                  <p>⛽ الوقود: {car.fuel_type} - ⚙️ القير: {car.transmission}</p>
                  <p>🛣️ كم : {car.mileage.toLocaleString('ar-SA')}</p>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  🛒 شراء السيارة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 