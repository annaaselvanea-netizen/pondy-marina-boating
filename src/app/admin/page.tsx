"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { CalendarCheck, IndianRupee, TrendingUp, Users, CalendarClock, XCircle, Trophy, Ticket } from "lucide-react";
import { db } from "@/lib/firebase/client";
import type { Booking, TimeSlot } from "@/types";
import StatsCard from "@/components/admin/StatsCard";
import { RevenueChart, PopularityChart } from "@/components/admin/RevenueChart";
import { inr } from "@/lib/pricing";

const ist = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    (async () => {
      const [b, s, c] = await Promise.all([
        getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(1000))),
        getDocs(collection(db, "timeSlots")),
        getDocs(collection(db, "customers")),
      ]);
      setBookings(b.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking));
      setSlots(s.docs.map((d) => ({ id: d.id, ...d.data() }) as TimeSlot));
      setCustomers(c.size);
    })();
  }, []);

  const m = useMemo(() => {
    if (!bookings) return null;
    const today = ist(), month = today.slice(0, 7);
    const live = bookings.filter((b) => b.bookingStatus !== "cancelled");
    const sum = (a: Booking[]) => a.reduce((t, b) => t + b.totalAmount, 0);
    const lastDays = Array.from({ length: 14 }, (_, i) => new Date(Date.now() + 5.5 * 3600_000 - (13 - i) * 864e5).toISOString().slice(0, 10));
    const byPkg = new Map<string, number>();
    live.forEach((b) => byPkg.set(b.packageName, (byPkg.get(b.packageName) ?? 0) + 1));
    const top = [...byPkg.entries()].sort((a, b) => b[1] - a[1])[0];
    const byMonth = new Map<string, number>();
    live.forEach((b) => byMonth.set(b.date.slice(0, 7), (byMonth.get(b.date.slice(0, 7)) ?? 0) + b.totalAmount));
    return {
      today: live.filter((b) => b.date === today).length,
      todayRev: sum(live.filter((b) => b.date === today)),
      monthRev: sum(live.filter((b) => b.date.startsWith(month))),
      upcoming: live.filter((b) => b.date >= today).length,
      cancelled: bookings.length - live.length,
      top: top?.[0] ?? "-",
      daily: lastDays.map((d) => ({ label: d.slice(5), value: live.filter((b) => b.date === d).length })),
      dailyRev: lastDays.map((d) => ({ label: d.slice(5), value: sum(live.filter((b) => b.date === d)) })),
      monthly: [...byMonth.entries()].sort().slice(-6).map(([label, value]) => ({ label, value })),
      pop: [...byPkg.entries()].map(([label, value]) => ({ label, value })),
      openSlots: slots.filter((s) => s.isActive && s.date >= today && s.bookedCount < s.capacity).length,
    };
  }, [bookings, slots]);

  if (!m) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-black/5" />)}</div>;

  const card = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5";
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-forest">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Today's bookings" value={m.today} icon={CalendarCheck} />
        <StatsCard label="Today's revenue" value={inr(m.todayRev)} icon={IndianRupee} />
        <StatsCard label="This month" value={inr(m.monthRev)} icon={TrendingUp} />
        <StatsCard label="Customers" value={customers} icon={Users} />
        <StatsCard label="Upcoming" value={m.upcoming} icon={CalendarClock} />
        <StatsCard label="Cancelled" value={m.cancelled} icon={XCircle} />
        <StatsCard label="Top package" value={m.top} icon={Trophy} />
        <StatsCard label="Open slots" value={m.openSlots} icon={Ticket} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}><h2 className="mb-3 font-medium">Daily bookings (14 days)</h2><RevenueChart data={m.daily} /></div>
        <div className={card}><h2 className="mb-3 font-medium">Daily revenue (₹)</h2><RevenueChart data={m.dailyRev} kind="line" /></div>
        <div className={card}><h2 className="mb-3 font-medium">Monthly revenue (₹)</h2><RevenueChart data={m.monthly} /></div>
        <div className={card}><h2 className="mb-3 font-medium">Package popularity</h2>{m.pop.length ? <PopularityChart data={m.pop} /> : <p className="py-20 text-center text-sm text-ink/50">No bookings yet.</p>}</div>
      </div>
    </div>
  );
}