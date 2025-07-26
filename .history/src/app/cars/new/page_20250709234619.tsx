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

export default function NewCarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-3xl mx-auto">
      <CarEntryForm />
    </div>
  );
}
