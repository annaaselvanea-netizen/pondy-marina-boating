import type { LucideIcon } from "lucide-react";
export default function StatsCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between text-ink/55"><p className="text-sm">{label}</p><Icon className="size-4" aria-hidden /></div>
      <p className="mt-2 font-serif text-3xl font-semibold text-forest">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}