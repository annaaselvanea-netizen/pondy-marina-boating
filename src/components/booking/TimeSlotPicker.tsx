"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Sunrise, Sunset, Flame } from "lucide-react";
import { getSlotsForDate } from "@/lib/services/catalog";
import type { TimeSlot } from "@/types";

const fmt = (t: string) => new Date(`2000-01-01T${t}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

export default function TimeSlotPicker({ date, selectedId, needSeats, isPrivate, onSelect }: {
  date: string; selectedId?: string; needSeats: number; isPrivate: boolean; onSelect: (s: TimeSlot) => void;
}) {
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSlots(null); setError(false);
    getSlotsForDate(date).then((s) => !cancelled && setSlots(s)).catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, [date]);

  if (error) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Couldn't load time slots. Please refresh and try again.</p>;
  if (!slots) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand-deep/60" />)}</div>;
  if (!slots.length) return <p className="rounded-xl bg-white p-6 text-center text-sm text-ink/60">No departures on this date. Please try another day.</p>;

  const now = Date.now();
  return (
    <div role="radiogroup" aria-label="Available time slots" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {slots.map((s) => {
        const left = s.capacity - s.bookedCount;
        const departed = new Date(`${s.date}T${s.startTime}:00+05:30`).getTime() < now;
        const unavailable = departed || (isPrivate ? s.bookedCount > 0 : left < needSeats);
        const selected = selectedId === s.id;
        return (
          <button key={s.id} type="button" role="radio" aria-checked={selected} disabled={unavailable} onClick={() => onSelect(s)}
            className={clsx("relative rounded-2xl border-2 p-4 text-left transition",
              selected ? "border-gold bg-forest text-white shadow-lg" : "border-sand-deep bg-white hover:border-mangrove",
              unavailable && "cursor-not-allowed opacity-45")}>
            {s.tag === "golden-hour" && <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-forest"><Sunset className="size-3" />GOLDEN HOUR</span>}
            {s.tag === "sunrise" && <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-ocean px-2 py-0.5 text-[10px] font-bold text-white"><Sunrise className="size-3" />SUNRISE</span>}
            <p className="font-serif text-2xl">{fmt(s.startTime)}</p>
            <p className={clsx("mt-1 text-xs", selected ? "text-sand/80" : "text-ink/60")}>
              {unavailable ? (departed ? "Departed" : isPrivate && s.bookedCount > 0 ? "Not private-ready" : "Sold out")
                : isPrivate ? "Whole boat available"
                : left <= 5 ? <span className="inline-flex items-center gap-1 font-semibold text-orange-500"><Flame className="size-3" />{left} seats left</span>
                : `${left} seats left`}
            </p>
          </button>
        );
      })}
    </div>
  );
}