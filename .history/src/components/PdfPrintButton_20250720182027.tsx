"use client";

interface PdfPrintButtonProps {
  pdfPath?: string;
  buttonText?: string;
  className?: string;
}

export default function PdfPrintButton({ 
  pdfPath = "/DASM-e-بتش-ديك.pdf", 
  buttonText = "🖨️ طباعة PDF", 
  className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
}: PdfPrintButtonProps) {
  
  const handlePrintPdf = () => {
    window.open(pdfPath, "_blank");
  };

  return (
    <button
      onClick={handlePrintPdf}
      className={className}
    >
      {buttonText}
    </button>
  );
} 