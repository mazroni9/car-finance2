import Link from 'next/link';
import InstallmentRulesTable from '@/components/InstallmentRulesTable';

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Action Button */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          قواعد التمويل والأقساط
        </h1>
        <Link 
          href="/admin/car-finance-entry"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
        >
          <span className="text-xl">📝</span>
          <div className="text-right">
            <div className="font-bold">إضافة قاعدة جديدة</div>
            <div className="text-sm opacity-90">Add New Rule</div>
          </div>
        </Link>
      </div>
      
      <InstallmentRulesTable />
    </div>
  );
}