"use client";

export default function PdfButton() {
  const handleClick = () => {
    const link = document.createElement('a');
    link.href = "/DASM-e-بتش-ديك.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
    >
      🖨️ طباعة PDF
    </button>
  );
} 