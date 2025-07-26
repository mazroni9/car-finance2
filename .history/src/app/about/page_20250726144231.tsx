"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            من نحن
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            منصة رائدة في مجال تمويل السيارات والتأجير المنتهي بالتمليك، 
            نقدم حلولاً مالية مبتكرة ومتطورة لجميع احتياجاتكم
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              أن نكون الشريك المالي الموثوق والرائد في مجال تمويل السيارات، 
              ونقدم حلولاً مبتكرة تسهل على عملائنا تحقيق أحلامهم في امتلاك السيارات 
              بأفضل الشروط وأكثرها مرونة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">مهمتنا</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              تقديم خدمات تمويل السيارات بأعلى معايير الجودة والشفافية، 
              مع التركيز على تلبية احتياجات العملاء المتنوعة وتقديم حلول مالية 
              مرنة ومستدامة تناسب جميع الفئات.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            خدماتنا المتكاملة
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">التمويل التقليدي</h3>
              <p className="text-gray-600">
                نظام تأجير منتهي بالتمليك تقليدي مع حسابات متقدمة وأقساط مرنة
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">التأجير المطور</h3>
              <p className="text-gray-600">
                نظام تأجير متطور مع خيارات متعددة ومرونة في الشروط والمدد
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">تمويل التاجر</h3>
              <p className="text-gray-600">
                حلول مالية مخصصة للتجار والمستثمرين مع شروط تنافسية
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">مميزاتنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <span>شروط مرنة وميسرة</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <span>موافقة سريعة</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <span>أسعار تنافسية</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <span>خدمة عملاء متميزة</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">قيمنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-2xl mr-3">🤝</span>
                <span>الشفافية والمصداقية</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">💪</span>
                <span>الموثوقية والاستقرار</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <span>الابتكار والتطوير</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">❤️</span>
                <span>رضا العملاء أولاً</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">تواصل معنا</h2>
          <p className="text-gray-600 mb-8 text-lg">
            نحن هنا لمساعدتك في تحقيق حلمك في امتلاك السيارة المناسبة
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link 
              href="/car-finance" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              ابدأ التمويل
            </Link>
            <Link 
              href="/cars" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              تصفح السيارات
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
} 