import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";

export default function AdminHomePage() {
  return (
    <AdminGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Admin dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Manage hero, gallery, services, blog and FAQ content for IVA.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/hero"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              Homepage
            </p>
            <p className="font-semibold text-slate-900">Hero & intro text</p>
            <p className="mt-1 text-xs text-slate-500">
              Edit headline, description and buttons on the homepage.
            </p>
          </Link>

          <Link
            href="/admin/gallery"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              Products
            </p>
            <p className="font-semibold text-slate-900">Gallery</p>
            <p className="mt-1 text-xs text-slate-500">
              Add, edit and remove rugs, colours, badges and images.
            </p>
          </Link>

          <Link
            href="/admin/services"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              Services
            </p>
            <p className="font-semibold text-slate-900">Cleaning & repairs</p>
            <p className="mt-1 text-xs text-slate-500">
              Manage service cards and bullet points.
            </p>
          </Link>

          <Link
            href="/admin/blog"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">Blog</p>
            <p className="font-semibold text-slate-900">Articles</p>
            <p className="mt-1 text-xs text-slate-500">
              Create and edit rug care guides and buying tips.
            </p>
          </Link>

          <Link
            href="/admin/about"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              Contact & brand
            </p>
            <p className="font-semibold text-slate-900">About & Contact</p>
            <p className="mt-1 text-xs text-slate-500">
              Edit brand name, phone, WhatsApp, email, address and map embed.
            </p>
          </Link>

          <Link
            href="/admin/faq"
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm hover:border-[var(--brand)] hover:shadow-md transition">
            <p className="mb-1 text-xs font-semibold text-slate-500">FAQ</p>
            <p className="font-semibold text-slate-900">Questions & answers</p>
            <p className="mt-1 text-xs text-slate-500">
              Manage common customer questions.
            </p>
          </Link>
        </div>
      </div>
    </AdminGate>
  );
}
