export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          صفحة الاختبار تعمل بنجاح! ✅
        </h1>
        <p className="text-gray-600">
          هذا يعني أن التوجيه يعمل بشكل صحيح
        </p>
        <a 
          href="/cars" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          الذهاب لصفحة السيارات
        </a>
      </div>
    </div>
  );
} 