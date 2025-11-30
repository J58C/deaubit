//components/QrCodeModal.tsx

"use client";

import { useState } from "react";
import { X, Download, Loader2, QrCode } from "lucide-react";

interface QrCodeModalProps {
  slug: string;
  shortUrl: string;
  onClose: () => void;
}

export default function QrCodeModal({
  slug,
  shortUrl,
  onClose,
}: QrCodeModalProps) {
  const [downloading, setDownloading] = useState(false);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=5&data=${encodeURIComponent(shortUrl)}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal mengunduh gambar.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm db-card db-card-pop p-6 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold flex items-center gap-2">
              <QrCode className="h-4 w-4 text-[var(--db-accent)]"/> QR Code
            </span>
            <span className="db-muted text-[10px] mt-0.5 font-mono">
              /{slug}
            </span>
          </div>
          <button className="db-btn-icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="aspect-square rounded-xl bg-white p-2 border border-[var(--db-border)] flex items-center justify-center overflow-hidden shadow-sm">
          <img 
            src={qrImageUrl} 
            alt={`QR Code for ${slug}`}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
        
        <div className="text-center">
             <p className="text-xs db-muted mb-1">Mengarahkan ke:</p>
             <p className="text-xs font-mono break-all bg-[var(--db-surface-muted)] py-1.5 px-3 rounded-lg border border-[var(--db-border-soft)]">
                 {shortUrl.replace(/^https?:\/\//, "")}
             </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="db-btn-ghost text-xs"
            onClick={onClose}
          >
            Tutup
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="db-btn-primary text-xs inline-flex items-center gap-2"
          >
            {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}