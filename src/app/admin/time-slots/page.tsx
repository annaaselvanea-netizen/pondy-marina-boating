"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { createSlot, updateSlot } from "@/lib/services/catalog";
import type { TimeSlot } from "@/types";

export default function TimeSlotsAdmin() {
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [f, setF] = useState({ date: "", startTime: "06:00", endTime: "07:00", capacity: 20, tag: "" });

  const load = () => getDocs(query(collection(db, "timeSlots"), orderBy("date", "desc")))
    .then((s) => setSlots(s.docs.map((d) => ({ id: d.id, ...d.data() }) as TimeSlot)));
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.date || f.endTime <= f.startTime || f.capacity < 1) return toast.error("Check date, times and capacity.");
    await createSlot({ ...f, tag: (f.tag || null) as TimeSlot["tag"], isActive: true });
    toast.success("Slot created"); load();
  }

  const i = "rounded-xl border border-black/10 px-3 py-2.5 text-sm";
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-forest">Time slots</h1>
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <label className="text-xs">Date<input type="date" className={`${i} block`} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
        <label className="text-xs">Start<input type="time" className={`${i} block`} value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} /></label>
        <label className="text-xs">End<input type="time" className={`${i} block`} value={f.endTime} onChange={(e) => setF({ ...f, endTime: e.target.value })} /></label>
        <label className="text-xs">Capacity<input type="number" min={1} className={`${i} block w-24`} value={f.capacity} onChange={(e) => setF({ ...f, capacity: +e.target.value })} /></label>
        <label className="text-xs">Tag<select className={`${i} block`} value={f.tag} onChange={(e) => setF({ ...f, tag: e.target.value })}><option value="">None</option><option value="sunrise">Sunrise</option><option value="golden-hour">Golden hour</option></select></label>
        <button className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white">Create slot</button>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase text-ink/55"><tr>{["Date", "Time", "Booked / Capacity", "Active", ""].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-black/5">
            {!slots && <tr><td colSpan={5} className="p-8 text-center">Loading…</td></tr>}
            {slots?.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-ink/50">No slots yet. Create your first departure above.</td></tr>}
            {slots?.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">{s.date}</td><td className="px-4 py-3">{s.startTime} – {s.endTime}</td>
                <td className="px-4 py-3">{s.bookedCount} / <input aria-label="Capacity" type="number" min={s.bookedCount} defaultValue={s.capacity} className="w-16 rounded border px-2 py-1"
                  onBlur={(e) => +e.target.value >= s.bookedCount ? updateSlot(s.id, { capacity: +e.target.value }).then(() => toast.success("Capacity saved")) : toast.error("Capacity can't be below booked seats")} /></td>
                <td className="px-4 py-3"><input type="checkbox" aria-label="Active" checked={s.isActive} onChange={(e) => updateSlot(s.id, { isActive: e.target.checked }).then(load)} /></td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}