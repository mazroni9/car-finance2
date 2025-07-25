'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

export default function ManualRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    showroomName: '',
    initialBalance: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. إنشاء المستخدم
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8), // كلمة مرور عشوائية
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            role: 'dealer'
          }
        }
      });

      if (userError) throw userError;

      // 2. إنشاء المحفظة
      const { error: walletError } = await supabase
        .from('wallets')
        .insert([
          {
            user_id: userData.user?.id,
            name: formData.showroomName,
            balance: parseFloat(formData.initialBalance) || 0,
            type: 'showroom',
            status: 'active'
          }
        ]);

      if (walletError) throw walletError;

      setMessage({
        type: 'success',
        text: '✅ تم تسجيل المعرض بنجاح! تم إرسال بيانات الدخول إلى البريد الإلكتروني.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        showroomName: '',
        initialBalance: '',
      });

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `❌ حدث خطأ: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">🧾 تسجيل معرض جديد</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المسؤول
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المعرض
            </label>
            <input
              type="text"
              required
              value={formData.showroomName}
              onChange={(e) => setFormData(prev => ({ ...prev, showroomName: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="اسم المعرض"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الرصيد الابتدائي
            </label>
            <input
              type="number"
              value={formData.initialBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '⏳ جاري التسجيل...' : '✅ تسجيل المعرض'}
          </button>
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