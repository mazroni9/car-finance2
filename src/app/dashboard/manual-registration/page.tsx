'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';

export default function ManualRegistrationPage() {
  const [showroomId, setShowroomId] = useState('');
  const [type, setType] = useState('registration');
  const [amount, setAmount] = useState(117);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showrooms, setShowrooms] = useState([]);

  // Load showrooms for dropdown
  useEffect(() => {
    const fetchShowrooms = async () => {
      const { data, error } = await supabase
        .from('showrooms')
        .select('id, name')
        .order('name');

      if (error) console.error(error);
      else setShowrooms(data || []);
    };

    fetchShowrooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!showroomId || !type || !amount) {
      setMessage('❌ الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }

    // ✅ Insert into showroom_transactions
    const { error } = await supabase
      .from('showroom_transactions')
      .insert([
        {
          showroom_id: showroomId,
          type,
          amount,
          description,
        }
      ]);

    if (error) {
      console.error('Error:', error);
      setMessage('❌ حدث خطأ أثناء التسجيل');
    } else {
      setMessage('✅ تم التسجيل بنجاح');
      // Reset form
      setShowroomId('');
      setDescription('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">✏️ تسجيل معاملة جديدة</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المعرض
            </label>
            <select
              value={showroomId}
              onChange={(e) => setShowroomId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر المعرض</option>
              {showrooms?.map((showroom) => (
                <option key={showroom.id} value={showroom.id}>
                  {showroom.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المبلغ
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل المعاملة
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
