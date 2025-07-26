'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface ShowroomData {
  id: string;
  name: string;
  balance: number;
  transactions_count: number;
  total_sales: number;
}

export default function ShowroomPage() {
  const [data, setData] = useState<ShowroomData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowroomData();
  }, []);

  async function fetchShowroomData() {
    try {
      const { data, error } = await supabase
        .from('showrooms')
        .select('*')
        .eq('name', 'mazbrothers')
        .single();

      if (error) throw error;
      setData(data);
    } catch (err) {
      console.error('Error fetching showroom data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">❌ لم يتم العثور على بيانات المعرض</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">🏬 لوحة تحكم معرض mazbrothers</h1>
      
      {/* إحصائيات المعرض */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">الرصيد الحالي</h3>
          <p className="text-2xl font-bold text-white">{data.balance.toLocaleString()} ريال</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">عدد العمليات</h3>
          <p className="text-2xl font-bold text-white">{data.transactions_count}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">إجمالي المبيعات</h3>
          <p className="text-2xl font-bold text-white">{data.total_sales?.toLocaleString()} ريال</p>
        </div>
      </div>

      {/* المزيد من المعلومات والإحصائيات يمكن إضافتها هنا */}
    </div>
  );
} 