'use client';

import { useState } from 'react';

interface SellButtonProps {
  onSell: () => void;
  disabled?: boolean;
}

export default function SellButton({ onSell, disabled = false }: SellButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onSell();
    } catch (error) {
      console.error('❌ خطأ أثناء البيع:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'جارٍ البيع...' : 'بيع السيارة'}
    </button>
  );
}
