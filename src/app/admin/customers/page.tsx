"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings?: number;
  totalSpent?: number;
  lastBookingAt?: { toDate: () => Date } | Date;
}

function formatDate(value: CustomerRecord["lastBookingAt"]) {
  if (!value) return "—";
  const date = value instanceof Date ? value : value.toDate();
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatMoney(value = 0) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDocs(collection(db, "customers")).then((snapshot) => {
      setCustomers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CustomerRecord)
        .sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0)));
    }).catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not load customers.");
      setCustomers([]);
    });
  }, []);

  const visible = customers?.filter((customer) => {
    const term = search.trim().toLowerCase();
    return !term || [customer.name, customer.phone, customer.email].some((value) => value?.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-4xl text-forest">Customers</h1><p className="mt-2 text-sm text-ink/60">Customer records are created when a booking is placed.</p></div>
        <label className="text-sm">Search<input type="search" placeholder="Name, phone, or email" className="mt-1 block w-full rounded-xl border border-black/10 px-3 py-2.5 sm:w-72" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-ink/55"><tr>{["Name", "Phone", "Email", "Bookings", "Total spent", "Last booking"].map((heading) => <th key={heading} scope="col" className="px-4 py-3">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-black/5">
            {customers === null && <tr><td colSpan={6} className="p-8 text-center">Loading customers…</td></tr>}
            {visible?.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-ink/50">{customers?.length ? "No customers match your search." : "No customers yet."}</td></tr>}
            {visible?.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 font-medium">{customer.name || "—"}</td>
                <td className="px-4 py-3">{customer.phone || customer.id}</td>
                <td className="px-4 py-3">{customer.email || "—"}</td>
                <td className="px-4 py-3">{customer.totalBookings ?? 0}</td>
                <td className="px-4 py-3">{formatMoney(customer.totalSpent)}</td>
                <td className="px-4 py-3">{formatDate(customer.lastBookingAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
