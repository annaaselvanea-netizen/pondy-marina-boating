"use client";
import { useEffect, useState } from "react";
import PackageCard from "./PackageCard";
import { getActivePackages } from "@/lib/services/catalog";
import type { BoatPackage } from "@/types";

export default function PackagesSection() {
  const [pkgs, setPkgs] = useState<BoatPackage[] | null>(null);
  useEffect(() => { getActivePackages().then(setPkgs); }, []);

  return (
    <section id="packages" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ocean">Packages</p>
        <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">Choose how you want to sail</h2>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pkgs === null
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[34rem] animate-pulse rounded-[2rem] bg-sand-deep/60" />)
          : pkgs.length === 0
            ? <p className="col-span-full text-center text-ink/60">Packages will be available shortly.</p>
            : pkgs.map((p) => <PackageCard key={p.id} pkg={p} featured={p.type === "private"} />)}
      </div>
    </section>
  );
}