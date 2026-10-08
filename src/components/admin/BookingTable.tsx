"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toast } from "sonner";
import { db, auth } from "@/lib/firebase/client";
import type { Booking, BookingStatus } from "@/types";
import { inr } from "@/lib/pricing";
import clsx from "clsx";

const TONE: Record<BookingStatus, string> = { pending: "bg-amber-100 text-amber-800", confirmed: "bg-emerald-100 text-emerald-800", completed: "bg-sky-100 text-sky-800", cancelled: "bg-red-100 text-red-700" };

export default function BookingTable() {
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [q, setQ] = useState(""); const [date, setDate] = useState(""); const [pkg, setPkg] = useState(""); const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = () => getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")))
    .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking))).catch(() => { setRows([]); toast.error("Failed to load bookings"); });
  useEffect(() => { load(); }, []);

  const packages = useMemo(() => [...new Set(rows?.map((r) => r.packageName))], [rows]);
  const filtered = useMemo(() => (rows ?? []).filter((r) =>
    (!q || [r.bookingNumber, r.customer.name, r.customer.phone].some((v) => v.toLowerCase().includes(q.toLowerCase()))) &&
    (!date || r.date === date) && (!pkg || r.packageName === pkg) && (!status || r.bookingStatus === status)), [rows, q, date, pkg, status]);

  async function update(id: string, patch: { bookingStatus?: BookingStatus; paymentStatus?: string }) {
    const token = await auth.currentUser!.getIdToken();
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(patch) });
    if (res.ok) { toast.success("Updated"); setSelected(null); load(); } else toast.error("Update failed");
  }

  const ctl = "rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <input aria-label="Search" placeholder="Search name, phone, booking no." value={q} onChange={(e) => setQ(e.target.value)} className={clsx(ctl, "min-w-60 flex-1")} />
        <input aria-label="Filter by date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={ctl} />
        <select aria-label="Filter by package" value={pkg} onChange={(e) => setPkg(e.target.value)} className={ctl}><option value="">All packages</option>{packages.map((p) => <option key={p}>{p}</option>)}</select>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className={ctl}><option value="">All statuses</option>{Object.keys(TONE).map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-black/[.03] text-xs uppercase tracking-wider text-ink/55">
            <tr>{["Booking", "Customer", "Package", "Date · Time", "Guests", "Total", "Status", "Payment", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows === null && Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={9} className="p-4"><div className="h-5 animate-pulse rounded bg-black/5" /></td></tr>)}
            {rows && !filtered.length && <tr><td colSpan={9} className="p-12 text-center text-ink/50">No bookings match your filters.</td></tr>}
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-black/[.02]">
                <td className="px-4 py-3 font-mono text-xs">{b.bookingNumber}</td>
                <td className="px-4 py-3"><p className="font-medium">{b.customer.name}</p><p className="text-xs text-ink/55">{b.customer.phone}</p></td>
                <td className="px-4 py-3">{b.packageName}</td>
                <td className="px-4 py-3">{b.date}<span className="block text-xs text-ink/55">{b.time}</span></td>
                <td className="px-4 py-3">{b.totalGuests}</td>
                <td className="px-4 py-3 font-medium">{inr(b.totalAmount)}</td>
                <td className="px-4 py-3"><span className={clsx("rounded-full px-2.5 py-1 text-xs font-medium", TONE[b.bookingStatus])}>{b.bookingStatus}</span></td>
                <td className="px-4 py-3"><span>{b.paymentStatus === "paid" ? "Deposit received" : b.paymentStatus}</span><span className="block text-xs text-ink/55">{inr(b.paidAmount ?? (b.paymentStatus === "paid" ? b.depositAmount ?? b.totalAmount : 0))} received{(b.balanceDue ?? 0) > 0 && <> · {inr(b.balanceDue ?? 0)} due</>}</span></td>
                <td className="px-4 py-3"><button className="text-ocean hover:underline" onClick={() => setSelected(b)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div role="dialog" aria-modal="true" aria-label="Booking details" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl">{selected.bookingNumber}</h2>
            <p className="text-sm">{selected.customer.name} · {selected.customer.phone} · {selected.customer.email}</p>
            <p className="text-sm">{selected.packageName} · {selected.date} · {selected.time}</p>
            <p className="text-sm">{selected.adults} adults, {selected.children} children, {selected.infants} infants · {inr(selected.totalAmount)}</p>
            <p className="text-sm">Payment: {selected.paymentStatus === "paid" ? "deposit received" : selected.paymentStatus} · {inr(selected.paidAmount ?? (selected.paymentStatus === "paid" ? selected.depositAmount ?? selected.totalAmount : 0))} received · {inr(selected.balanceDue ?? 0)} due</p>
            {selected.notes && <p className="rounded-xl bg-sand p-3 text-sm">{selected.notes}</p>}
            <div className="flex flex-wrap gap-2 pt-2">
              {(["confirmed", "completed"] as const).map((s) => <button key={s} onClick={() => update(selected.id, { bookingStatus: s })} className="rounded-full bg-forest px-4 py-2 text-sm text-white capitalize">Mark {s}</button>)}
              {selected.paymentStatus !== "paid" && <button onClick={() => update(selected.id, { paymentStatus: "paid" })} className="rounded-full bg-ocean px-4 py-2 text-sm text-white">Mark deposit received</button>}
              {selected.bookingStatus !== "cancelled" && <button onClick={() => confirm("Cancel this booking and release seats?") && update(selected.id, { bookingStatus: "cancelled" })} className="rounded-full bg-red-600 px-4 py-2 text-sm text-white">Cancel booking</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}