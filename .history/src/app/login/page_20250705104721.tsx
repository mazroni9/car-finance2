'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else router.push('/dealer/dashboard');
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded-lg shadow-lg bg-white space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        className="border rounded w-full p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        className="border rounded w-full p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-green-600 text-white rounded p-2 hover:bg-green-700 transition"
      >
        دخول
      </button>
    </div>
  );
}
