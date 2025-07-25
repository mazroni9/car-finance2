// app/dashboard/showroom-wallets/page.tsx

import { createClient } from '@/lib/supabase/server';  // ✅ هذا المسار الصحيح عندك
import Link from 'next/link';

export default async function ShowroomWalletsPage() {
  const supabase = createClient();

  // نجلب البيانات من View أو Table جاهز
  const { data, error } = await supabase
    .from('showroom_wallets_view')  // تأكد من وجود هذا الـ VIEW في قاعدتك
    .select('*');

  if (error) {
    console.error(error);
    return <div className="p-6">❌ حدث خطأ في جلب البيانات: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">🏬 محافظ المعارض</h1>
      <p className="text-gray-400 mb-6">ملخص الرصيد والأرضيات ورسوم التسجيل لجميع المعارض.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-3 text-blue-400">📌 اسم المعرض</th>
              <th className="border border-gray-700 p-3 text-blue-400">💰 الرصيد</th>
              <th className="border border-gray-700 p-3 text-blue-400">🏠 إجمالي الأرضية</th>
              <th className="border border-gray-700 p-3 text-blue-400">📜 رسوم التسجيل</th>
              <th className="border border-gray-700 p-3 text-blue-400">🧾 عدد العمليات</th>
              <th className="border border-gray-700 p-3 text-blue-400">🔗 التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.showroom_id} className="hover:bg-gray-700">
                <td className="border border-gray-700 p-3 text-white">{item.showroom_name}</td>
                <td className="border border-gray-700 p-3 text-white">{item.balance?.toLocaleString()} ريال</td>
                <td className="border border-gray-700 p-3 text-white">{item.total_floor_fees?.toLocaleString()} ريال</td>
                <td className="border border-gray-700 p-3 text-white">{item.total_registration_fees?.toLocaleString()} ريال</td>
                <td className="border border-gray-700 p-3 text-white">{item.transaction_count}</td>
                <td className="border border-gray-700 p-3">
                  <Link
                    href={`/dashboard/showrooms/${item.showroom_id}`}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    عرض التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
