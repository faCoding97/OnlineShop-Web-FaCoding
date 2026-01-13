"use client";

import { useState } from "react";

type Props = {
  className?: string;
};

export default function CopyLinkButton({ className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)] " +
        className
      }>
      <span>Copy link</span>
      {copied && <span className="text-[10px] text-emerald-600">copied!</span>}
    </button>
  );
}
