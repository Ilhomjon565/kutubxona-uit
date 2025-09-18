'use client';

import React, { useState } from 'react';
import { X, Download, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

interface PDFReaderProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
  bookTitle?: string;
}

const PDFReader: React.FC<PDFReaderProps> = ({ pdfUrl, isOpen, onClose, bookTitle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = bookTitle ? `${bookTitle}.pdf` : 'book.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {bookTitle || 'PDF O\'qish'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Yuklab olish"
          >
            <Download className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Yangi oynada ochish"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title={isFullscreen ? 'Kichiklashtirish' : 'To\'liq ekran'}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={bookTitle || 'PDF Viewer'}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>PDF fayl: {pdfUrl.split('/').pop()}</span>
          <div className="flex items-center space-x-4">
            <span>Zoom: 100%</span>
            <span>1/1 sahifa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;

