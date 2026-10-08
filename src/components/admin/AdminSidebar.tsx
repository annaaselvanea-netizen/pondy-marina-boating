"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { LayoutDashboard, CalendarCheck, Package, Clock, Users, Image as Img, Star, Settings, LogOut, Menu } from "lucide-react";
import clsx from "clsx";
import { auth } from "@/lib/firebase/client";

const NAV = [
  ["Dashboard", "/admin", LayoutDashboard], ["Bookings", "/admin/bookings", CalendarCheck], ["Packages", "/admin/packages", Package],
  ["Time Slots", "/admin/time-slots", Clock], ["Customers", "/admin/customers", Users], ["Gallery", "/admin/gallery", Img],
  ["Reviews", "/admin/reviews", Star], ["Settings", "/admin/settings", Settings],
] as const;

export default function AdminSidebar() {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Open menu" className="fixed left-4 top-4 z-40 rounded-lg bg-forest p-2.5 text-white md:hidden" onClick={() => setOpen(!open)}><Menu /></button>
      <aside className={clsx("fixed inset-y-0 left-0 z-30 w-64 bg-forest text-sand transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <p className="px-6 py-7 font-serif text-2xl text-white">Pondy Marina<span className="block text-[10px] uppercase tracking-[0.35em] text-gold">Admin</span></p>
        <nav aria-label="Admin" className="space-y-1 px-3">
          {NAV.map(([l, h, I]) => (
            <Link key={h} href={h} onClick={() => setOpen(false)} aria-current={path === h ? "page" : undefined}
              className={clsx("flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition", path === h ? "bg-white/12 text-white" : "hover:bg-white/8")}>
              <I className="size-4" aria-hidden />{l}
            </Link>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-sand/70 hover:text-white"><LogOut className="size-4" />Sign out</button>
      </aside>
    </>
  );
}