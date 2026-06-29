"use client";

export default function ExportPDF({ title }: { title: string }) {
  const exportPdf = () => {
    const prose = document.querySelector(".prose");
    if (!prose) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - DevOps Formation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; }
          h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
          h2 { color: #1e3a5f; margin-top: 30px; }
          h3 { color: #374151; }
          pre { background: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
          pre code { background: none; padding: 0; }
          table { border-collapse: collapse; width: 100%; margin: 16px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
          th { background: #f9fafb; font-weight: 600; }
          blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="border:none;margin:0;">🚀 DevOps Formation</h1>
          <p style="color:#6b7280;">devops-formation.onrender.com</p>
        </div>
        ${prose.innerHTML}
        <div class="footer">
          <p>Exporté depuis DevOps Formation — ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <button onClick={exportPdf} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors" title="Exporter en PDF">
      📄 PDF
    </button>
  );
}
