'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase/supabaseClient';

export default function ManualRegistration() {
  const supabase = supabaseClient();

  // ✅ نثبت معرف المعرض
  const showroomId = '2bf61df6-da52-45f1-88c4-05316e51df04';

  const [type, setType] = useState('registration');
  const [amount, setAmount] = useState<number>(117);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!type || !amount) {
      setMessage('❌ الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }

    // ✅ Insert into showroom_transactions
    const { error } = await supabase.from('showroom_transactions').insert([
      {
        showroom_id: showroomId,
        type,
        amount,
        description,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage('❌ حدث خطأ أثناء التسجيل.');
    } else {
      setMessage('✅ تم تسجيل العملية بنجاح!');
      setType('registration');
      setAmount(117);
      setDescription('');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🧾 تسجيل عملية يدوية</h1>
      <p className="mb-4 text-gray-600">
        هذه الصفحة مخصصة لإدخال عملية يدوية لمعرض <strong className="text-black">mazbrothers</strong>.
      </p>

      {/* ✅ 📌 تذكير مهم */}
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded leading-relaxed text-sm">
        <p>📌 <strong>تذكير مهم:</strong></p>
        <p className="mt-2">✅ هذه الصفحة مرتبطة فقط بمعرض <strong>mazbrothers</strong>.</p>
        <p>✅ عند تسجيل عملية هنا، تتم إضافة سجل جديد في جدول <strong>showroom_transactions</strong> في قاعدة البيانات.</p>
        <p>✅ هذه العملية لا تخصم ولا تضيف تلقائيًا على رصيد المعرض في <strong>showroom_wallets</strong>.</p>
        <p>✅ وظيفتها تسجيل العمليات التي تتم يدويًا خارج النظام، مثل رسوم أرضية أو مرور كرام.</p>
        <p>✅ أي تحديث لرصيد المحفظة يتطلب تنفيذ وظيفة مخصصة أو معالجة منفصلة في النظام.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Select */}
        <div>
          <label className="block font-semibold mb-1">نوع العملية</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="floor_fee">رسوم أرضية</option>
            <option value="registration">تسجيل ملكية</option>
            <option value="external_registration">تسجيل خارجي (مرور كرام)</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block font-semibold mb-1">المبلغ (ريال)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min={0}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">وصف (اختياري)</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🟢 تسجيل العملية
        </button>
      </form>

      {message && (
        <div className="mt-4 p-2 text-center rounded border">
          {message}
        </div>
      )}
    </div>
  );
}
