'use client';

import { Download, Printer } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'qrcode.react';
import { formatCurrency } from '@/utils/formatCurrency';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TicketDownloadProps {
  order: any;
  event: any;
}

export default function TicketDownload({ order, event }: TicketDownloadProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  // Format the event date
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    // Create a canvas from the ticket element
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions to fit the PDF page
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`ticket-${order.verification_code}.pdf`);
  };

  const handlePrint = () => {
    if (!ticketRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const ticketHtml = ticketRef.current.outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Event Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .ticket { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="ticket">${ticketHtml}</div>
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="w-full max-w-2xl border border-gray-300 rounded-lg p-6 mb-8 bg-white" ref={ticketRef}>
        <div className="flex flex-col">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{eventDate}</p>
              <p className="text-gray-600">{event.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <div>
              <h3 className="text-lg font-semibold">Ticket Details</h3>
              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Total: {formatCurrency(order.total_amount, 'NGN')}</p>
              <div className="mt-2">
                <p className="font-semibold">Verification Code:</p>
                <p className="font-mono text-xl bg-gray-100 px-3 py-1 rounded">{order.verification_code}</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <QRCode 
                value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://booking-app.com'}/verify-ticket/${order.verification_code}`} 
                size={128}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4 text-center text-sm text-gray-500">
            <p>Present this ticket at the venue entrance.</p>
            <p>This ticket is valid for one-time entry only.</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          Download Ticket
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} />
          Print Ticket
        </button>
      </div>
    </>
  );
} 