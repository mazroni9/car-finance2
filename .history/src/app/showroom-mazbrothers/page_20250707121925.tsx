'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import Link from 'next/link';

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

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return '0';
    return num.toLocaleString('ar-SA');
  };

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
      {/* زر العودة للرئيسية في الأعلى */}
      <div className="flex justify-end mb-4">
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>العودة للرئيسية</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </a>
      </div>

      {/* صف العنوان وبقية الأزرار */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">🏬 لوحة تحكم معرض mazbrothers</h1>
        <div className="flex gap-4">
          <Link 
            href="/showroom-mazbrothers/linked-cars"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            <span>ربط السيارات</span>
          </Link>
          <Link 
            href="/showroom-mazbrothers/manual-registration"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>✏️</span>
            <span>تسجيل طلب جديد</span>
          </Link>
        </div>
      </div>
      
      {/* إحصائيات المعرض */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">الرصيد الحالي</h3>
          <p className="text-2xl font-bold text-white">{formatNumber(data.balance)} ريال</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">عدد العمليات</h3>
          <p className="text-2xl font-bold text-white">{formatNumber(data.transactions_count)}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">إجمالي المبيعات</h3>
          <p className="text-2xl font-bold text-white">{formatNumber(data.total_sales)} ريال</p>
        </div>
      </div>

      {/* المزيد من المعلومات والإحصائيات يمكن إضافتها هنا */}
    </div>
  );
} 