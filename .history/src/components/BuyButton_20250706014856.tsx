'use client';

import { useState } from 'react';

interface BuyButtonProps {
  carId: string;
  price: number;
}

export function BuyButton({ carId, price }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          amount: price,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في عملية الشراء');
      }

      // تحديث الواجهة أو عرض رسالة نجاح
      alert('تم الشراء بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء عملية الشراء');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={isLoading}
      className={`
        inline-block px-4 py-2 rounded-lg
        ${isLoading 
          ? 'bg-blue-300 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700'
        }
        text-white font-medium
      `}
    >
      {isLoading ? 'جارٍ الشراء...' : 'شراء'}
    </button>
  );
} 