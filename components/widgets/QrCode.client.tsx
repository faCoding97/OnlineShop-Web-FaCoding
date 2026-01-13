"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  value: string;
  size?: number;
  includeDownload?: boolean;
};

export default function QrCode({
  value,
  size = 120,
  includeDownload = false,
}: Props) {
  // 👇 این دیگه typeش HTMLDivElement هست، نه QRCodeCanvas
  const ref = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    if (!includeDownload) return;

    try {
      const canvas = ref.current?.querySelector(
        "canvas"
      ) as HTMLCanvasElement | null;

      if (!canvas) return;

      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "IVA-qr.png";
      link.click();
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div
        ref={ref}
        className="rounded-xl bg-white p-3 shadow border border-slate-200">
        <QRCodeCanvas value={value} size={size} includeMargin />
      </div>

      {includeDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="text-xs md:text-sm inline-flex items-center gap-1 rounded-full border border-[var(--brand)]/40 px-3 py-1 bg-white text-[var(--brand)] hover:bg-[var(--brand)]/5 transition">
          Download PNG
        </button>
      )}
    </div>
  );
}
