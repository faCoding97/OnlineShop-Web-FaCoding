"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/faq", label: "FAQ" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex items-center justify-between gap-4 py-3">
      {/* سمت چپ: عنوان و لینک‌های ادمین */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)]/10 text-xs font-semibold text-[var(--brand)]">
            A
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Admin · IVA
            </p>
            <p className="text-[11px] text-slate-400">
              Manage content & gallery items
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isActive(link.href)
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* سمت راست: لینک مشاهده سایت + بعداً می‌تونی Logout هم اضافه کنی */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)]">
          <span className="text-[11px]">↗</span>
          <span>View site</span>
        </Link>
      </div>
    </nav>
  );
}
