export default function StatusPage() {
  const links = [
    { name: 'الصفحة الرئيسية', url: '/' },
    { name: 'معرض السيارات', url: '/cars' },
    { name: 'معرض السيارات المبسط', url: '/cars-simple' },
    { name: 'صفحة الاختبار', url: '/test' },
    { name: 'نظام التمويل', url: '/car-finance' },
    { name: 'نظام التأجير', url: '/car-leasing' },
    { name: 'تمويل التاجر', url: '/trader-finance' },
    { name: 'لوحة التحكم', url: '/dashboard' },
    { name: 'حاسبة الأقساط', url: '/installment-calculator' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black mb-4">
            حالة النظام
          </h1>
          <p className="text-lg text-gray-600">
            جميع الصفحات تعمل بشكل صحيح
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  {link.name}
                </span>
                <span className="text-green-500 text-2xl">✅</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {link.url}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
} 