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

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/services/supabase';

export default function NewCarPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    color: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    description: '',
    images: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Parse images to JSON array
      const imagesArray = JSON.parse(form.images);

      const { error } = await supabase.from('car_showcase').insert([
        {
          make: form.make,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          color: form.color,
          mileage: Number(form.mileage),
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          description: form.description,
          image_url: imagesArray,
        },
      ]);

      if (error) {
        setMessage('❌ حدث خطأ أثناء إضافة السيارة');
        console.error(error);
      } else {
        setMessage('✅ تمت إضافة السيارة بنجاح!');
        setForm({
          make: '',
          model: '',
          year: '',
          price: '',
          color: '',
          mileage: '',
          fuel_type: '',
          transmission: '',
          description: '',
          images: '',
        });
        // يمكنك إعادة التوجيه
        router.push('/cars');
      }
    } catch (err) {
      setMessage('❌ تأكد من أن روابط الصور مكتوبة بشكل JSON Array صالح');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        ✨ إضافة سيارة جديدة
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4 text-right"
      >
        <input name="make" placeholder="الماركة" className="input" value={form.make} onChange={handleChange} required />
        <input name="model" placeholder="الموديل" className="input" value={form.model} onChange={handleChange} required />
        <input name="year" placeholder="السنة" className="input" value={form.year} onChange={handleChange} required type="number" />
        <input name="price" placeholder="السعر" className="input" value={form.price} onChange={handleChange} required type="number" />
        <input name="color" placeholder="اللون" className="input" value={form.color} onChange={handleChange} required />
        <input name="mileage" placeholder="الممشى" className="input" value={form.mileage} onChange={handleChange} required type="number" />
        <input name="fuel_type" placeholder="نوع الوقود" className="input" value={form.fuel_type} onChange={handleChange} required />
        <input name="transmission" placeholder="القير" className="input" value={form.transmission} onChange={handleChange} required />
        <textarea
          name="description"
          placeholder="الوصف"
          className="input"
          value={form.description}
          onChange={handleChange}
          required
        />

        <textarea
          name="images"
          placeholder='["https://link1.jpg", "https://link2.jpg"]'
          className="input"
          value={form.images}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition"
        >
          {loading ? 'يتم الحفظ...' : 'إضافة السيارة'}
        </button>

        {message && <p className="mt-2 text-center">{message}</p>}
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          direction: rtl;
        }
      `}</style>
    </div>
  );
}
