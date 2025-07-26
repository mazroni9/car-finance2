"use client";

export default function PdfTestPage() {
  const handlePrintPdf = () => {
    const link = document.createElement('a');
    link.href = "/DASM-e-بتش-ديك.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          اختبار زر طباعة PDF
        </h1>
        <div className="text-center">
          <button
            onClick={handlePrintPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow text-lg font-bold"
          >
            🖨️ طباعة ملف PDF
          </button>
          <p className="mt-4 text-gray-600">
            سيتم فتح ملف "DASM-e-بتش-ديك.pdf" في نافذة جديدة
          </p>
        </div>
      </div>
    </div>
  );
} 