import { Container } from "@/components/ui/Container";
import QrCode from "@/components/widgets/QrCode.client";
import Reveal from "@/components/widgets/Reveal.client";

type HeroConfig = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: string;
  alt?: string;
};

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--bg)] to-white/60">
      <Container className="py-16 md:py-24">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
            <div className="space-y-6">
              {hero.eyebrow && (
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--brand)]">
                  {hero.eyebrow}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                {hero.title}
              </h1>
              {hero.description && (
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  {hero.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {hero.primaryCta && (
                  <a
                    href={hero.primaryCta.href}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] text-white text-sm font-medium px-5 py-2.5 hover:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--bg)]">
                    {hero.primaryCta.label}
                  </a>
                )}
                {hero.secondaryCta && (
                  <a
                    href={hero.secondaryCta.href}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--brand)]/30 bg-white text-[var(--brand)] text-sm font-medium px-5 py-2.5 hover:bg-[var(--brand)]/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--bg)]">
                    {hero.secondaryCta.label}
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 pt-3">
                Fast delivery in Klerksdorp and helpful guidance on choosing the
                perfect items for your lifestyle and budget.
              </p>
            </div>

            <div className="relative">
              <div className="card p-4 md:p-5 flex flex-col gap-4 items-center">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                  {hero.image ? (
                    <img
                      src={hero.image}
                      alt={hero.alt ?? "Rug from IVA in a living space"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                      Rug imagery
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-medium text-slate-700">
                    Scan to open the full gallery
                  </p>
                  <QrCode value="https://IVA.co.za/gallery" includeDownload />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
