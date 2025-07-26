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
    const link = document.createElement('a');
    link.href = pdfPath;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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