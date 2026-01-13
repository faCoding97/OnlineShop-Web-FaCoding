import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full text-sm font-medium px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--bg)]";
  const variants: Record<string, string> = {
    primary: "bg-[var(--brand)] text-white hover:brightness-95",
    secondary:
      "border border-[var(--brand)]/30 bg-white text-[var(--brand)] hover:bg-[var(--brand)]/5",
    ghost: "text-slate-800 hover:bg-slate-100/60",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
