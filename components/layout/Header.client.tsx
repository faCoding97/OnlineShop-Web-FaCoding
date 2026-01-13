"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  nav: NavItem[];
};

export default function Header({ nav }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors backdrop-blur",
        scrolled
          ? "bg-[var(--bg)]/95 border-slate-200"
          : "bg-[var(--bg)]/80 border-transparent"
      )}>
      <Container className="flex items-center justify-between py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center border border-[var(--brand)]/30">
            <span className="text-sm font-semibold tracking-tight text-[var(--brand)]">
              <img
                src="/og-image.png"
                alt="My Rug Logo"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-md"
              />
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-base">IVA</span>
            <span className="text-xs text-slate-600">
              Everything &amp; You Need · Klerksdorp
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-1 py-1",
                "text-slate-700 hover:text-slate-900",
                pathname === item.href && "text-[var(--brand)] font-medium"
              )}>
              {item.label}
              {pathname === item.href && (
                <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[var(--brand)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)] text-white text-xs font-medium px-3 py-1.5 hover:brightness-95 transition">
            Browse gallery
          </Link>
          <button
            type="button"
            onClick={() => setOpen((x) => !x)}
            aria-label="Toggle navigation"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 bg-white/80 hover:bg-white transition">
            <div className="relative w-4 h-3">
              <span
                className={cn(
                  "absolute left-0 right-0 h-[2px] rounded-full bg-slate-900 transition-transform",
                  open ? "top-1.5 rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 h-[2px] rounded-full bg-slate-900 transition-all",
                  open ? "opacity-0 top-1.5" : "top-1.5"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 h-[2px] rounded-full bg-slate-900 transition-transform",
                  open ? "bottom-1.5 -rotate-45" : "bottom-0"
                )}
              />
            </div>
          </button>
        </div>
      </Container>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-[var(--bg)]/98">
          <Container>
            <nav className="flex flex-col py-3 gap-1 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-1 py-2 rounded-md",
                    pathname === item.href
                      ? "text-[var(--brand)] font-medium bg-white"
                      : "text-slate-700 hover:bg-white/70"
                  )}>
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                  )}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
