'use client';

import PlatformWalletSummary from '@/components/PlatformWalletSummary';

export default function PlatformWalletPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">💰 رصيد المنصة</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <PlatformWalletSummary />
      </div>
    </div>
  );
} 