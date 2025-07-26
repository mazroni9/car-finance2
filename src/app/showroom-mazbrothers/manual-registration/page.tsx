'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import Link from 'next/link';

export default function ShowroomManualRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    carPrice: '',
    initialPayment: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. إنشاء العميل
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            showroom_id: 'mazbrothers' // معرف المعرض الثابت
          }
        ])
        .select()
        .single();

      if (customerError) throw customerError;

      // 2. إنشاء طلب السيارة
      const { error: carRequestError } = await supabase
        .from('car_requests')
        .insert([
          {
            customer_id: customerData.id,
            car_model: formData.carModel,
            price: parseFloat(formData.carPrice),
            initial_payment: parseFloat(formData.initialPayment),
            status: 'pending',
            showroom_id: 'mazbrothers'
          }
        ]);

      if (carRequestError) throw carRequestError;

      setMessage({
        type: 'success',
        text: '✅ تم تسجيل الطلب بنجاح!'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        carModel: '',
        carPrice: '',
        initialPayment: '',
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع';
      console.error('Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/showroom-mazbrothers"
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <span>←</span>
          <span>رجوع</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">🚗 تسجيل طلب سيارة جديد</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بيانات العميل */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">معلومات العميل</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العميل
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="الاسم الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الجوال
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="05xxxxxxxx"
              />
            </div>
          </div>

          {/* بيانات السيارة */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">معلومات السيارة</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موديل السيارة
              </label>
              <input
                type="text"
                required
                value={formData.carModel}
                onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="نوع وموديل السيارة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر السيارة
              </label>
              <input
                type="number"
                required
                value={formData.carPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, carPrice: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الدفعة الأولى
              </label>
              <input
                type="number"
                required
                value={formData.initialPayment}
                onChange={(e) => setFormData(prev => ({ ...prev, initialPayment: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? '⏳ جاري التسجيل...' : '✅ تسجيل الطلب'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
} 