// app/services/page.tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import Reveal from "@/components/widgets/Reveal.client";
import { formatPriceZAR } from "@/lib/utils";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[]; // 👈 همیشه آرایه (اگر چیزی نبود = [])
  fromPriceZAR: number | null;
};

export const revalidate = 60; // ISR هر ۶۰ ثانیه

export default async function ServicesPage() {
  const supabase = createServerSupabaseAdminClient();

  // 👇 هم سرویس‌ها، هم بولت‌ها را با هم می‌گیریم
  const [servicesRes, bulletsRes] = await Promise.all([
    supabase
      .from("site_services")
      .select("id, title, description, from_price_zar, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_service_bullets")
      .select("service_id, bullet")
      .order("id", { ascending: true }),
  ]);

  if (servicesRes.error) {
    console.error("Error fetching services:", servicesRes.error.message);
  }
  if (bulletsRes.error) {
    console.error("Error fetching service bullets:", bulletsRes.error.message);
  }

  const rawServices = servicesRes.data ?? [];
  const rawBullets = bulletsRes.data ?? [];

  // 🔁 گروپ کردن بولت‌ها بر اساس service_id
  const bulletsByService: Record<string, string[]> = {};
  for (const row of rawBullets as any[]) {
    if (!bulletsByService[row.service_id]) {
      bulletsByService[row.service_id] = [];
    }
    bulletsByService[row.service_id].push(row.bullet);
  }

  // 🔁 مپ کردن داده‌های Supabase → ساختار موردنیاز کامپوننت
  const services: Service[] = (rawServices as any[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    fromPriceZAR: row.from_price_zar ?? null, // 👈 تبدیل به camelCase
    bullets: bulletsByService[row.id] ?? [], // 👈 آرایه بولت‌ها
  }));

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <Reveal>
          <header className="max-w-3xl mb-10">
            <p className="text-sm font-medium tracking-wide text-[var(--brand)] uppercase mb-2">
              Services
            </p>
            <h1 className="text-3xl md:py-4 font-semibold tracking-tight mb-4">
              Rug cleaning, repairs and home consultations.
            </h1>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              Beyond selling rugs, we look after them. From professional
              cleaning and repairs to custom underlays and home trials, our
              services are designed around real homes in Gqeberha (Port
              Elizabeth).
            </p>
          </header>
        </Reveal>

        <div className="grid gap-6 sm:gap-7 lg:gap-8 lg:grid-cols-2">
          {services.map((service) => (
            <Reveal key={service.id}>
              <Card className="h-full flex flex-col p-4 sm:p-5 lg:p-6">
                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold">{service.title}</h2>
                  <p className="text-sm text-slate-700">
                    {service.description}
                  </p>

                  {service.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {service.bullets.map((b, idx) => (
                        <li key={idx}>• {b}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  {service.fromPriceZAR !== null ? (
                    <p className="text-sm font-medium text-slate-900">
                      From{" "}
                      <span className="text-[var(--brand)]">
                        {formatPriceZAR(service.fromPriceZAR)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Contact for pricing</span>
                    </p>
                  )}

                  <Link
                    href="/about#contact"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--brand)]/30 bg-white text-[var(--brand)] text-xs font-medium px-4 py-1.5 hover:bg-[var(--brand)]/5 transition">
                    Booking essential
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
