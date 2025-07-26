import React from 'react';

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 mt-12 mx-auto max-w-lg border border-gray-200">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-green-700 mb-2">تمت عملية الشراء بنجاح!</h1>
      <p className="text-lg text-gray-700 mb-6">شكراً لثقتك بنا. سنقوم بمعالجة طلبك في أسرع وقت.</p>
      <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">العودة للرئيسية</a>
    </div>
  );
}
