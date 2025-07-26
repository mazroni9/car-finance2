/**
 * File: /app/cars/new/page.tsx
 *
 * Car Create Page
 *
 * 📜 Arabic-friendly, fully responsive
 * ✅ Displays form to add a new car
 * ✅ Supports all car fields
 * ✅ Saves to Supabase table car_showcase
 * ✅ Simple styling with Tailwind
 *
 * Author: YourTeam
 * Created: 2024-07-01
 */

'use client';

import CarEntryForm from '@/components/CarEntryForm';
import Link from 'next/link';

export default function NewCarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-3xl mx-auto">
      <div className="flex justify-end mb-6">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
      <CarEntryForm />
    </div>
  );
}
