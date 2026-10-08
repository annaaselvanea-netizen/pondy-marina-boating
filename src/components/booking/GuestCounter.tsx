"use client";
import { Minus, Plus } from "lucide-react";

interface Props { label: string; hint?: string; value: number; min?: number; max?: number; onChange: (n: number) => void }

export default function GuestCounter({ label, hint, value, min = 0, max = 20, onChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-sand-deep bg-white p-4">
      <div>
        <p className="font-medium text-forest" id={`gc-${label}`}>{label}</p>
        {hint && <p className="text-xs text-ink/60">{hint}</p>}
      </div>
      <div role="group" aria-labelledby={`gc-${label}`} className="flex items-center gap-3">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}
          className="grid size-10 place-items-center rounded-full border border-forest/20 text-forest transition enabled:hover:bg-forest enabled:hover:text-white disabled:opacity-30"><Minus className="size-4" /></button>
        <output aria-live="polite" className="w-6 text-center font-serif text-2xl">{value}</output>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}
          className="grid size-10 place-items-center rounded-full border border-forest/20 text-forest transition enabled:hover:bg-forest enabled:hover:text-white disabled:opacity-30"><Plus className="size-4" /></button>
      </div>
    </div>
  );
}