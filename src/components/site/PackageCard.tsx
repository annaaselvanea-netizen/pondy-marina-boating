import Link from "next/link";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import type { BoatPackage } from "@/types";
import { inr } from "@/lib/pricing";
import clsx from "clsx";

export default function PackageCard({ pkg, featured }: { pkg: BoatPackage; featured?: boolean }) {
  const startPrice = pkg.type === "private" ? Math.min(...(pkg.privateTiers ?? []).map((t) => t.price)) : pkg.pricePerPerson ?? 0;
  const unit = pkg.type === "private" ? "/trip" : "/person";

  return (
    <article className={clsx("relative flex flex-col overflow-hidden rounded-[2rem] border bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
      featured ? "border-gold shadow-xl shadow-gold/20 lg:scale-[1.04]" : "border-sand-deep")}>
      {featured && <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-forest"><Sparkles className="size-3" />Most loved</span>}
      <div className="relative h-48 bg-gradient-to-br from-mangrove to-ocean">
        {pkg.imageUrl && <Image src={pkg.imageUrl} alt={pkg.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-serif text-3xl text-forest">{pkg.name}</h3>
        <p className="mt-1 flex items-baseline gap-1.5">
          {pkg.type === "private" && <span className="text-sm text-ink/60">From</span>}
          <span className="font-serif text-4xl font-semibold text-mangrove">{inr(startPrice)}</span>
          <span className="text-sm text-ink/60">{unit}</span>
          {pkg.type === "bulk" && pkg.listPricePerPerson && <s className="text-sm text-ink/40">{inr(pkg.listPricePerPerson)}</s>}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/75">{pkg.description}</p>
        <ul className="mt-5 space-y-2.5 text-sm">
          {pkg.features.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />{f}</li>)}
        </ul>
        {pkg.agePolicy && (
          <div className="mt-5 rounded-xl bg-sand p-4 text-xs text-ink/75">
            <p className="mb-1 font-semibold text-forest">Age policy</p>
            {pkg.agePolicy.map((a) => <p key={a}>{a}</p>)}
          </div>
        )}
        <Link href={`/booking?package=${pkg.id}`} className="mt-auto pt-7">
          <span className="block rounded-full bg-forest py-3.5 text-center text-sm font-bold tracking-[0.12em] text-white transition hover:bg-mangrove">{pkg.ctaLabel}</span>
        </Link>
      </div>
    </article>
  );
}