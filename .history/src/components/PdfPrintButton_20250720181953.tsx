"use client";

import React from 'react';

interface PdfPrintButtonProps {
  pdfPath?: string;
  buttonText?: string;
  className?: string;
}

export default function PdfPrintButton(props: PdfPrintButtonProps) {
  const { 
    pdfPath = "/DASM-e-بتش-ديك.pdf", 
    buttonText = "🖨️ طباعة PDF", 
    className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
  } = props;
  
  const handlePrintPdf = () => {
    const newWindow = window.open(pdfPath, '_blank');
    if (newWindow) {
      setTimeout(() => {
        newWindow.print();
      }, 1000);
    }
  };

  return React.createElement('button', {
    onClick: handlePrintPdf,
    className: className
  }, buttonText);
} 