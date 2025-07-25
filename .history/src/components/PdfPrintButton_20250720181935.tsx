"use client";

import React from 'react';

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
    // فتح ملف PDF في نافذة جديدة
    const newWindow = window.open(pdfPath, '_blank');
    
    if (newWindow) {
      // إذا فتحت النافذة بنجاح، انتظر قليلاً ثم اطبع
      setTimeout(() => {
        newWindow.print();
      }, 1000);
    } else {
      // إذا فشل فتح النافذة، جرب تحميل الملف مباشرة
      const link = document.createElement('a');
      link.href = pdfPath;
      link.target = '_blank';
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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