import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

export default function Testimonials({
  id,
  title,
  items,
}: {
  id?: string;
  title: string;
  items: Testimonial[];
}) {
  return (
    <div>
      <SectionTitle
        id={id}
        title={title}
        lead="Real reviews from shoppers who trust IVA for everything."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {items.slice(0, 3).map((t) => (
          <Card key={t.name} className="p-5 flex flex-col gap-3">
            <p className="text-sm text-slate-800 leading-relaxed">
              “{t.quote}”
            </p>
            <div className="mt-auto pt-2 text-xs text-slate-700">
              <p className="font-semibold">{t.name}</p>
              {t.role && <p>{t.role}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
