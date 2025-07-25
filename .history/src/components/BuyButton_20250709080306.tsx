'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import Link from "next/link";

interface BuyButtonProps {
  carId: string;
  price: number;
  onSuccess?: () => void;
}

export default function BuyButton({ carId, price, onSuccess }: BuyButtonProps) {
  return (
    <Link
      href={`/cars/${carId}?showCosts=1`}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors block text-center"
    >
      🛒 شراء السيارة
    </Link>
  );
}
