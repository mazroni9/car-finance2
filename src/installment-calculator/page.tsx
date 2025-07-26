import Link from 'next/link';

const sampleCars = [
  {
    id: 1,
    name: 'تويوتا كامري 2024',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  },
  {
    id: 2,
    name: 'هونداي سوناتا 2024',
    price: 115000,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800',
  },
  {
    id: 3,
    name: 'كيا K5 2024',
    price: 105000,
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* قسم الترحيب */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)]">
            نظام تمويل وتقسيط السيارات
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            نظام متكامل لإدارة تمويل وتقسيط السيارات بكل سهولة وفعالية
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="button-primary"
            >
              ابدأ الآن
            </Link>
            <Link 
              href="/about"
              className="button-secondary"
            >
              تعرف علينا
            </Link>
          </div>
        </div>
      </section>

      {/* عرض السيارات */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">السيارات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {car.price.toLocaleString()} ريال
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الأقسام الرئيسية */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/cars" className="group">
              <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">معرض السيارات</h3>
                <p className="text-[var(--text-secondary)]">استعرض جميع السيارات المتاحة للتمويل</p>
              </div>
            </Link>

            <Link href="/finance" className="group">
              <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">حاسبة التمويل</h3>
                <p className="text-[var(--text-secondary)]">احسب قسطك الشهري بكل سهولة</p>
              </div>
            </Link>

            <Link href="/dashboard" className="group">
              <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">لوحة التحكم</h3>
                <p className="text-[var(--text-secondary)]">إدارة وتتبع عمليات التمويل</p>
              </div>
            </Link>

            <Link href="/reports" className="group">
              <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">التقارير</h3>
                <p className="text-[var(--text-secondary)]">تقارير وإحصائيات تفصيلية</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[var(--text-primary)]">+1000</div>
              <div className="text-sm text-[var(--text-secondary)]">سيارة تم تمويلها</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[var(--text-primary)]">98%</div>
              <div className="text-sm text-[var(--text-secondary)]">نسبة رضا العملاء</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[var(--text-primary)]">24/7</div>
              <div className="text-sm text-[var(--text-secondary)]">دعم متواصل</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[var(--text-primary)]">15+</div>
              <div className="text-sm text-[var(--text-secondary)]">سنوات خبرة</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
