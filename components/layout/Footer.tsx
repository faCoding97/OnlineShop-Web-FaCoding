// components/layout/Footer.tsx
import { Container } from "@/components/ui/Container";
import Link from "next/link";

type OrgSocialLink = {
  platform: string;
  url: string;
};

type Org = {
  brandName?: string;
  brand_name?: string;
  domain?: string;
};

type Contact = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string | null;
};

type Props = {
  org: Org | null;
  contact: Contact | null;
  socialLinks?: OrgSocialLink[];
};

export default function Footer({ org, contact, socialLinks }: Props) {
  const brandName = org?.brandName ?? org?.brand_name ?? "IVA";

  const instagramUrl = socialLinks?.find(
    (s) => s.platform === "instagram"
  )?.url;
  const facebookUrl = socialLinks?.find((s) => s.platform === "facebook")?.url;

  const instagramHandle =
    instagramUrl
      ?.replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\/$/, "") || "IVAza";

  const facebookHandle =
    facebookUrl
      ?.replace(/^https?:\/\/(www\.)?facebook\.com\//, "")
      .replace(/\/$/, "") || "IVAza";

  return (
    <footer className="border-t border-slate-200 bg-white/80 mt-10">
      <Container className="py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left */}
          <div className="space-y-4 max-w-lg">
            <p className="text-sm font-semibold text-slate-900">
              {brandName} · Premium rugs in Klerksdorp
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              IVA · Your Everything Store in Klerksdorp Shop everything online –
              from daily essentials to big finds. Fast delivery and great
              service for real South African shoppers. 
            </p>

            <div className="flex flex-col sm:flex-row gap-5 text-xs text-slate-600">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="group flex items-center gap-2.5 transition-all duration-300 hover:text-indigo-600">
                  <svg
                    className="w-4 h-4 text-slate-500 shrink-0 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                    {contact.phone}
                  </span>
                </a>
              )}

              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-2.5 transition-all duration-300 hover:text-indigo-600">
                  <svg
                    className="w-4 h-4 text-slate-500 shrink-0 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                    {contact.email}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-3 text-xs text-slate-600">
            {contact?.address && (
              <div className="group flex items-start gap-2.5 transition-all duration-300 hover:text-indigo-600 cursor-default">
                <svg
                  className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                  {contact.address}
                </p>
              </div>
            )}

            {contact?.hours && (
              <div className="group flex items-start gap-2.5 transition-all duration-300 hover:text-indigo-600 cursor-default">
                <svg
                  className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                  {contact.hours}
                </p>
              </div>
            )}

            {/* Instagram */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 transition-all duration-300 hover:text-indigo-600">
                <svg
                  className="w-4 h-4 text-slate-500 shrink-0 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                  @{instagramHandle}
                </span>
              </a>
            )}

            {/* Facebook */}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 transition-all duration-300 hover:text-indigo-600 ml-10">
                <svg
                  className="w-4 h-4 text-slate-500 shrink-0 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M22 12.07C22 6.505 17.523 2 12 2S2 6.505 2 12.07C2 17.08 5.657 21.245 10.438 22v-6.999H8.078v-2.93h2.36V9.845c0-2.335 1.393-3.622 3.523-3.622 1.02 0 2.087.183 2.087.183v2.3h-1.177c-1.16 0-1.52.723-1.52 1.463v1.757h2.59l-.414 2.93h-2.176V22C18.343 21.245 22 17.08 22 12.07z" />
                </svg>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                  {facebookHandle}
                </span>
              </a>
            )}

            {/* Admin link */}
            <div className="group flex items-start gap-2.5 transition-all duration-300 hover:text-indigo-600 cursor-default">
              <Link
                href="/admin"
                className="group inline-flex items-center gap-2.5 transition-all duration-300 hover:text-indigo-600">
                <svg
                  className="w-5 h-5 text-slate-500 shrink-0 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 3a7 7 0 00-7 7c0 1.834.702 3.503 1.85 4.763.188-.287.406-.556.652-.79C8.853 14.788 10.363 14 12 14c1.638 0 3.147.788 4.498 2.01.246.223.464.492.652.79A6.97 6.97 0 0019 12a7 7 0 00-7-7zm0 2a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 group-hover:after:w-full">
                  Admin Panel
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-gray-900 flex flex-col sm:flex-row items-center gap-2 sm:gap-1">
            <span className="whitespace-nowrap">Written by:</span>
            <a
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r font-medium rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base"
              href="https://elixcode.com/"
              target="_blank"
              rel="noopener noreferrer">
              <img
                src="/logo/ElixCodeLogo.png"
                alt="Elix Code Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
              Elix Code
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
