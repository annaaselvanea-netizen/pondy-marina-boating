"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship } from "lucide-react";

export default function StickyCTA() {
  const path = usePathname();
  if (path.startsWith("/booking") || path.startsWith("/admin")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <Link href="/booking" className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-[#e8c070] py-4 text-sm font-bold tracking-[0.15em] text-forest shadow-2xl shadow-black/30">
        <Ship className="size-5" aria-hidden /> BOOK YOUR BOAT
      </Link>
    </div>
  );
}