"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Anchor } from "lucide-react";
import clsx from "clsx";

const LINKS = [["Experience", "/experience"], ["Packages", "/packages"], ["Gallery", "/gallery"], ["Contact", "/contact"]] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={clsx("fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "bg-forest/90 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5")}>
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-gold/90 text-forest"><Anchor className="size-5" aria-hidden /></span>
          <span className="leading-none">
            <span className="block font-serif text-xl font-semibold tracking-wide">Pondy Marina</span>
            <span className="block text-[10px] uppercase tracking-[0.35em] text-sand/80">Boating</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map(([l, h]) => (
            <li key={h}><Link href={h} className="text-sm font-medium tracking-wide text-white/85 transition hover:text-gold">{l}</Link></li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/booking" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-forest shadow transition hover:bg-white">Book Now</Link>
          <button className="text-white md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-forest/95 backdrop-blur-md px-5 pb-6 pt-4">
          <ul className="space-y-1">
            {LINKS.map(([l, h]) => (
              <li key={h}><Link onClick={() => setOpen(false)} href={h} className="block rounded-lg px-3 py-3 font-serif text-2xl text-white hover:bg-white/10">{l}</Link></li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}