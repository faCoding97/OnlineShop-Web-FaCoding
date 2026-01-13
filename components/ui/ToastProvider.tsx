"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right" // 👈 همون چیزی که گفتی: پایین-راست
      richColors
      closeButton
      duration={3000} // بعد ۳ ثانیه خودکار محو می‌شه
    />
  );
}
