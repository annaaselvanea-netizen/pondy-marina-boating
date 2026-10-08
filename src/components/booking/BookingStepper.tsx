"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { getActivePackages } from "@/lib/services/catalog";
import { calculatePrice, inr, type PriceBreakdown } from "@/lib/pricing";
import { bookingSchema } from "@/lib/validation";
import type { BoatPackage, TimeSlot } from "@/types";
import GuestCounter from "./GuestCounter";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingSummary from "./BookingSummary";

const STEPS = ["Package", "Date", "Time", "Guests", "Details", "Review"] as const;
const todayIST = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

export default function BookingStepper() {
  const router = useRouter();
  const params = useSearchParams();
  const [packages, setPackages] = useState<BoatPackage[] | null>(null);
  const [step, setStep] = useState(0);
  const [pkg, setPkg] = useState<BoatPackage | null>(null);
  const [tierId, setTierId] = useState<string>();
  const [date, setDate] = useState(todayIST());
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getActivePackages().then((list) => {
      setPackages(list);
      const pre = list.find((p) => p.id === params.get("package"));
      if (pre) { setPkg(pre); setStep(1); }
    });
  }, [params]);

  const isPrivate = pkg?.type === "private";
  const tier = pkg?.privateTiers?.find((t) => t.id === tierId);

  const { price, priceError } = useMemo<{ price: PriceBreakdown | null; priceError: string | null }>(() => {
    if (!pkg) return { price: null, priceError: null };
    try { return { price: calculatePrice(pkg, { ...guests, tierId }), priceError: null }; }
    catch (e) { return { price: null, priceError: (e as Error).message }; }
  }, [pkg, guests, tierId]);

  const canNext = [
    !!pkg && (!isPrivate || !!tierId),
    !!date,
    !!slot,
    !!price,
    true,
    true,
  ][step];

  function next() {
    if (step === 4) {
      const r = bookingSchema.safeParse({ packageId: pkg!.id, tierId, slotId: slot!.id, ...guests, customer: { name: form.name, phone: form.phone, email: form.email }, notes: form.notes });
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach((i) => { e[i.path.at(-1) as string] = i.message; });
        setErrors(e); toast.error("Please fix the highlighted fields."); return;
      }
      setErrors({});
    }
    setStep((s) => s + 1);
  }

  async function confirm() {
    if (!pkg || !slot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, tierId, slotId: slot.id, ...guests, customer: { name: form.name, phone: form.phone, email: form.email }, notes: form.notes }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Booking failed."); if (res.status === 409) setStep(2); return; }
      toast.success("Booking confirmed!");
      router.push(`/booking/confirmation/${data.bookingNumber}?t=${data.accessToken}`);
    } catch { toast.error("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  const input = (k: keyof typeof form, label: string, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={k} className="mb-1.5 block text-sm font-medium text-forest">{label}</label>
      <input id={k} type={type} autoComplete={autoComplete} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined}
        className={clsx("w-full rounded-xl border bg-white px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-gold", errors[k] ? "border-red-400" : "border-sand-deep")} />
      {errors[k] && <p id={`${k}-err`} role="alert" className="mt-1 text-xs text-red-600">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-24 pt-32 lg:grid-cols-[1fr_22rem] lg:px-8">
      <div>
        <ol aria-label="Booking progress" className="mb-8 flex items-center gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className="flex shrink-0 items-center gap-1.5">
              <span className={clsx("grid size-8 place-items-center rounded-full text-xs font-bold transition",
                i < step ? "bg-mangrove text-white" : i === step ? "bg-gold text-forest ring-4 ring-gold/30" : "bg-sand-deep text-ink/50")}>
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={clsx("text-xs font-medium", i === step ? "text-forest" : "hidden text-ink/50 sm:inline")}>{s}</span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-5 bg-sand-deep" aria-hidden />}
            </li>
          ))}
        </ol>

        <section className="min-h-[22rem] rounded-3xl bg-sand-deep/30 p-5 sm:p-8" aria-live="polite">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-forest">Choose your experience</h2>
              {packages === null ? <div className="h-32 animate-pulse rounded-2xl bg-sand-deep/60" /> : packages.map((p) => (
                <button key={p.id} type="button" onClick={() => { setPkg(p); setTierId(undefined); setSlot(null); }}
                  aria-pressed={pkg?.id === p.id}
                  className={clsx("w-full rounded-2xl border-2 bg-white p-5 text-left transition", pkg?.id === p.id ? "border-gold shadow-lg" : "border-transparent hover:border-mangrove")}>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="font-serif text-2xl text-forest">{p.name}</p><p className="mt-1 text-sm text-ink/65">{p.description}</p></div>
                    <p className="shrink-0 font-serif text-2xl text-mangrove">{p.type === "private" ? `from ${inr(Math.min(...p.privateTiers!.map((t) => t.price)))}` : `${inr(p.pricePerPerson!)}`}</p>
                  </div>
                </button>
              ))}
              {isPrivate && (
                <fieldset className="grid gap-3 sm:grid-cols-2">
                  <legend className="mb-2 text-sm font-medium text-forest">Group size</legend>
                  {pkg!.privateTiers!.map((t) => (
                    <button type="button" key={t.id} aria-pressed={tierId === t.id} onClick={() => { setTierId(t.id); setGuests({ adults: Math.min(t.maxGuests, 2), children: 0, infants: 0 }); }}
                      className={clsx("rounded-xl border-2 bg-white p-4 text-left", tierId === t.id ? "border-gold" : "border-sand-deep")}>
                      <p className="font-medium text-forest">{t.label}</p>
                      <p className="text-xs text-ink/60">{t.minGuests === t.maxGuests ? `${t.maxGuests}` : `${t.minGuests}–${t.maxGuests}`} guests</p>
                      <p className="mt-1 font-serif text-xl text-mangrove">{inr(t.price)}</p>
                    </button>
                  ))}
                </fieldset>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl text-forest">Pick your date</h2>
              <label htmlFor="date" className="mt-6 block text-sm font-medium text-forest">Travel date</label>
              <input id="date" type="date" min={todayIST()} value={date} onChange={(e) => { setDate(e.target.value); setSlot(null); }}
                className="mt-1.5 w-full rounded-xl border border-sand-deep bg-white px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-gold sm:w-72" />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-6 font-serif text-3xl text-forest">Select a departure</h2>
              <TimeSlotPicker date={date} selectedId={slot?.id} isPrivate={!!isPrivate} needSeats={isPrivate ? 1 : guests.adults + guests.children} onSelect={setSlot} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="mb-4 font-serif text-3xl text-forest">Who's coming?</h2>
              <GuestCounter label="Adults" hint="Age 5 and above" value={guests.adults} onChange={(adults) => setGuests({ ...guests, adults })} max={isPrivate ? tier?.maxGuests : 40} />
              <GuestCounter label="Children" hint="Age 2–4 · half ticket" value={guests.children} onChange={(children) => setGuests({ ...guests, children })} max={isPrivate ? tier?.maxGuests : 40} />
              <GuestCounter label="Infants" hint="Below 2 · free" value={guests.infants} onChange={(infants) => setGuests({ ...guests, infants })} max={5} />
              {priceError && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{priceError}</p>}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="mb-2 font-serif text-3xl text-forest">Your details</h2>
              {input("name", "Full name", "text", "name")}
              {input("phone", "Phone (WhatsApp preferred)", "tel", "tel")}
              {input("email", "Email", "email", "email")}
              <div>
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-forest">Special request (optional)</label>
                <textarea id="notes" rows={3} maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-sand-deep bg-white px-4 py-3.5 outline-none focus:ring-2 focus:ring-gold" placeholder="Proposal setup, birthday surprise, accessibility needs…" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-serif text-3xl text-forest">Review & confirm</h2>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-ink/55">Name</dt><dd className="font-medium">{form.name}</dd></div>
                <div><dt className="text-ink/55">Phone</dt><dd className="font-medium">{form.phone}</dd></div>
                <div className="sm:col-span-2"><dt className="text-ink/55">Email</dt><dd className="font-medium">{form.email}</dd></div>
                {form.notes && <div className="sm:col-span-2"><dt className="text-ink/55">Request</dt><dd>{form.notes}</dd></div>}
              </dl>
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-between">
          <button type="button" disabled={step === 0 || submitting} onClick={() => setStep(step - 1)} className="rounded-full px-6 py-3 font-medium text-forest disabled:opacity-0">Back</button>
          {step < 5 ? (
            <button type="button" disabled={!canNext} onClick={next} className="rounded-full bg-forest px-9 py-3.5 font-semibold text-white transition enabled:hover:bg-mangrove disabled:opacity-40">Continue</button>
          ) : (
            <button type="button" disabled={submitting} onClick={confirm} className="inline-flex items-center gap-2 rounded-full bg-gold px-9 py-3.5 font-bold text-forest shadow-lg transition hover:bg-white disabled:opacity-60">
              {submitting && <Loader2 className="size-4 animate-spin" />} Confirm Booking
            </button>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        {pkg && price && slot ? (
          <BookingSummary packageName={pkg.name} tierLabel={price.tierLabel} date={date} time={`${slot.startTime} – ${slot.endTime}`} {...guests} price={price} isPrivate={!!isPrivate} />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-sand-deep p-8 text-center text-sm text-ink/55">Your booking summary will appear here as you choose.</div>
        )}
      </div>
    </div>
  );
}