import { inr, type PriceBreakdown } from "@/lib/pricing";

interface Props { packageName: string; tierLabel?: string; date: string; time: string; adults: number; children: number; infants: number; price: PriceBreakdown; isPrivate: boolean }

export default function BookingSummary({ packageName, tierLabel, date, time, adults, children, infants, price, isPrivate }: Props) {
  const row = (l: string, v: string, strong = false) => (
    <div className={`flex justify-between py-2 ${strong ? "border-t border-forest/15 pt-4 font-serif text-2xl text-forest" : "text-sm"}`}><dt>{l}</dt><dd>{v}</dd></div>
  );
  return (
    <aside aria-label="Booking summary" className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sand-deep">
      <h3 className="font-serif text-2xl text-forest">{packageName}</h3>
      {tierLabel && <p className="text-sm text-mangrove">{tierLabel}</p>}
      <dl className="mt-4 divide-y divide-sand-deep/60">
        {row("Date", new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }))}
        {row("Time", time)}
        {row("Guests", `${adults} adult · ${children} child${infants ? ` · ${infants} infant` : ""}`)}
        {!isPrivate && row(`Adults (${adults})`, inr(price.adultAmount))}
        {!isPrivate && children > 0 && row(`Children (${children})`, inr(price.childAmount))}
        {row("Subtotal", inr(price.subtotal))}
        {price.discount > 0 && <div className="flex justify-between py-2 text-sm font-medium text-leaf"><dt>Discount</dt><dd>− {inr(price.discount)}</dd></div>}
      </dl>
      <dl>{row("Total", inr(price.total), true)}</dl>
      <p className="mt-3 text-xs text-ink/55">Pay at the jetty or via UPI on arrival. Online payment can be added later.</p>
    </aside>
  );
}