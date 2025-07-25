export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MAZ Brothers</h3>
            <p className="text-gray-400">
              نقدم أفضل خدمات تمويل السيارات في المملكة العربية السعودية
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/cars" className="text-gray-400 hover:text-white">
                  معرض السيارات
                </a>
              </li>
              <li>
                <a href="/wallet" className="text-gray-400 hover:text-white">
                  المحفظة
                </a>
              </li>
              <li>
                <a href="/transactions" className="text-gray-400 hover:text-white">
                  المعاملات
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                📞 +966 XX XXX XXXX
              </li>
              <li className="text-gray-400">
                ✉️ info@mazbrothers.com
              </li>
              <li className="text-gray-400">
                📍 الرياض، المملكة العربية السعودية
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            جميع الحقوق محفوظة © {new Date().getFullYear()} MAZ Brothers
          </p>
        </div>
      </div>
    </footer>
  );
} 