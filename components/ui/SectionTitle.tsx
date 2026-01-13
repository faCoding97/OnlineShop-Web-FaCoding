type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
};

export function SectionTitle({ id, eyebrow, title, lead }: Props) {
  return (
    <div className="max-w-3xl mb-8">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--brand)] mb-2">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="text-2xl md:text-3xl font-semibold tracking-tight mb-3"
      >
        {title}
      </h2>
      {lead && (
        <p className="text-sm md:text-base text-slate-700 leading-relaxed">
          {lead}
        </p>
      )}
    </div>
  );
}
