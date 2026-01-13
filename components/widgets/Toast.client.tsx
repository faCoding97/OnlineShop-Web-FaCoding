"use client";

type Props = {
  message: string;
  open: boolean;
};

export default function Toast({ message, open }: Props) {
  if (!open) return null;
  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center z-50">
      <div className="rounded-full bg-slate-900 text-white text-xs px-4 py-2 shadow-lg">
        {message}
      </div>
    </div>
  );
}
