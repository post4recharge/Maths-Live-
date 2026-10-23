import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 260, className = '' }) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setDataUrl(url);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
        setError('QR तयार करण्यात अडचण आली');
      });
  }, [value, size]);

  if (error) {
    return (
      <div className="w-64 h-64 flex items-center justify-center bg-slate-800 text-slate-400 rounded-2xl p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center p-3 bg-white rounded-3xl shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/30 ${className}`}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code to Join Quiz"
          width={size}
          height={size}
          className="rounded-2xl"
        />
      ) : (
        <div style={{ width: size, height: size }} className="flex items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
