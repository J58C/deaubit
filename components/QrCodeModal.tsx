//components/QrCodeModal.tsx

"use client";

import { useState } from "react";
import { X, Download, Loader2, QrCode } from "lucide-react";

interface QrCodeModalProps { slug: string; shortUrl: string; onClose: () => void; }

export default function QrCodeModal({ slug, shortUrl, onClose }: QrCodeModalProps) {
  const [downloading, setDownloading] = useState(false);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=5&data=${encodeURIComponent(shortUrl)}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `qr-${slug}.png`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url);
    } catch { alert("Gagal."); } finally { setDownloading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] p-6 space-y-6">
        <div className="flex items-center justify-between border-b-4 border-[var(--db-border)] pb-4">
          <div>
            <h3 className="text-lg font-black uppercase flex items-center gap-2 text-[var(--db-text)]">
              <QrCode className="h-5 w-5" /> QR CODE
            </h3>
            <p className="text-xs font-mono bg-[var(--db-accent)] text-black px-1 inline-block mt-1">/{slug}</p>
          </div>
          <button onClick={onClose} className="border-2 border-[var(--db-border)] p-1 hover:bg-red-500 hover:text-white transition-colors"><X className="h-5 w-5"/></button>
        </div>

        <div className="bg-white border-4 border-[var(--db-border)] p-2 flex items-center justify-center">
          <img src={qrImageUrl} alt={`QR ${slug}`} className="w-full h-full object-contain" loading="eager" />
        </div>
        
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold border-2 border-[var(--db-border)] hover:bg-[var(--db-bg)] text-[var(--db-text)]">CLOSE</button>
          <button onClick={handleDownload} disabled={downloading} className="flex-1 py-3 font-bold bg-[var(--db-primary)] text-white border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Download className="h-4 w-4"/> PNG</>}
          </button>
        </div>
      </div>
    </div>
  );
}