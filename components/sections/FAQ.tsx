import { SectionTitle } from "@/components/ui/SectionTitle";

type FAQItem = {
  q: string;
  a: string;
};

export default function FAQ({ id, items }: { id?: string; items: FAQItem[] }) {
  return (
    <div>
      <SectionTitle
        id={id}
        title="Frequently asked questions"
        lead="If you have a question that is not answered here, please contact us and our team in Klerksdorp will be happy to help."
      />
      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1">
              <span className="text-sm font-medium text-slate-900">
                {item.q}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600">
                +
              </span>
            </summary>
            <p className="mt-2 pb-2 text-sm text-slate-700 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
