
// @ts-ignore
import { jsPDF } from 'jspdf';

export const exportService = {
  downloadAsPDF: (content: string, filename: string) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);
    
    // Clean markdown symbols for a cleaner PDF text output
    const cleanContent = content
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '•');

    const splitText = doc.splitTextToSize(cleanContent, maxWidth);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    let cursorY = 20;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.getHeight();

    splitText.forEach((line: string) => {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    doc.save(`${filename}.pdf`);
  },

  downloadAsDocx: (content: string, filename: string) => {
    // Generate a Microsoft Word compatible HTML document
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.5; font-size: 11pt; }
          h1 { font-size: 18pt; border-bottom: 1px solid #ccc; }
          h2 { font-size: 14pt; color: #2e74b5; margin-top: 15pt; }
          ul { margin-bottom: 10pt; }
        </style>
      </head>
      <body>
    `;
    const footer = "</body></html>";
    
    // Simple markdown to HTML conversion for Word
    const htmlBody = content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    const finalHtml = header + htmlBody + footer;
    const blob = new Blob([finalHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
