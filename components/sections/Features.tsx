// components/sections/Features.tsx
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { formatPriceZAR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type Feature = {
  title: string;
  description: string;
};

export default function Features({
  id,
  title,
  description,
  featuredGallery,
  extraFeatures,
}: {
  id?: string;
  title: string;
  description: string;
  featuredGallery?: any[];
  extraFeatures?: Feature[];
}) {
  return (
    <div>
      <SectionTitle id={id} title={title} lead={description} />

      {featuredGallery && featuredGallery.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {featuredGallery.map((item: any) => (
            <Link key={item.id} href={`/gallery/${item.id}`} className="block">
              <Card className="overflow-hidden flex flex-col cursor-pointer">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    {item.category} • {item.size}
                    {item.dimensions ? ` • ${item.dimensions}` : ""}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-1 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[var(--brand)]">
                      {formatPriceZAR(item.priceZAR)}
                    </p>
                    {item.badges && item.badges.length > 0 && (
                      <Badge className="text-[10px] px-2 py-0.5">
                        {item.badges[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {extraFeatures && extraFeatures.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          {extraFeatures.map((feature) => (
            <Card key={feature.title} className="p-5">
              <h3 className="text-base font-semibold mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-700">{feature.description}</p>
            </Card>
          ))}
        </div>
      )}

      {(!featuredGallery || featuredGallery.length === 0) &&
        (!extraFeatures || extraFeatures.length === 0) && (
          <p className="text-sm text-slate-600">
            More information coming soon.
          </p>
        )}
    </div>
  );
}
