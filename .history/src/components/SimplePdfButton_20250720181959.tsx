"use client";

export default function SimplePdfButton() {
  const handlePrintPdf = () => {
    window.open("/DASM-e-بتش-ديك.pdf", "_blank");
  };

  return (
    <button
      onClick={handlePrintPdf}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
    >
      🖨️ طباعة PDF
    </button>
  );
} 