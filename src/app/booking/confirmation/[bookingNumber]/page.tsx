"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { DEPOSIT_PERCENT, getDepositAmount } from "@/lib/payments";

interface BookingConfirmation {
  bookingNumber: string;
  packageName: string;
  tierLabel?: string | null;
  date: string;
  time: string;
  adults: number;
  children: number;
  infants: number;
  totalGuests: number;
  totalAmount: number;
  depositAmount?: number;
  paidAmount?: number;
  balanceDue?: number;
  paymentStatus: string;
  bookingStatus: string;
  customer: { name: string; phone: string; email: string };
}

type LoadState =
  | { status: "loading" }
  | { status: "success"; booking: BookingConfirmation }
  | { status: "error"; message: string };

const inr = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams<{ bookingNumber: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("t");
  const [state, setState] = useState<LoadState>(() => token
    ? { status: "loading" }
    : { status: "error", message: "This confirmation link is missing its access token." });
  const [qrUnavailable, setQrUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    if (!token) return;

    const query = new URLSearchParams({ t: token });
    fetch(`/api/bookings/${encodeURIComponent(bookingNumber)}?${query.toString()}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(response.status === 404
            ? "This booking could not be found. Check that you opened the original confirmation link."
            : data.error ?? "Could not load the booking confirmation.");
        }
        return data as BookingConfirmation;
      })
      .then((booking) => {
        if (active) setState({ status: "success", booking });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Could not load the booking confirmation.",
          });
        }
      });

    return () => { active = false; };
  }, [bookingNumber, token]);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32">
      {state.status === "loading" && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-ink/60">Loading your booking confirmation…</p>
        </div>
      )}

      {state.status === "error" && (
        <section className="space-y-5 rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <h1 className="font-serif text-3xl text-forest">Confirmation unavailable</h1>
          <p role="alert" className="text-sm text-ink/65">{state.message}</p>
          <Link href="/booking" className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Start a new booking</Link>
        </section>
      )}

      {state.status === "success" && (
        <article id="ticket" className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          <header className="bg-forest px-6 py-8 text-center text-white sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Pondy Mangrove Boating</p>
            <h1 className="mt-3 font-serif text-4xl">Booking confirmed</h1>
            <p className="mt-2 text-sm text-sand/80">Your boating experience is reserved.</p>
          </header>

          <div className="grid gap-8 p-6 sm:grid-cols-[1fr_auto] sm:p-10">
            <section className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">Booking number</p>
                <p className="mt-1 font-mono text-xl font-semibold text-forest">{state.booking.bookingNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">Experience</p>
                <p className="mt-1 font-medium">{state.booking.packageName}</p>
                {state.booking.tierLabel && <p className="text-sm text-ink/60">{state.booking.tierLabel}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Date</p><p className="mt-1 font-medium">{state.booking.date}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Time</p><p className="mt-1 font-medium">{state.booking.time}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Guests</p><p className="mt-1 font-medium">{state.booking.totalGuests}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Amount</p><p className="mt-1 font-medium">{inr(state.booking.totalAmount)}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Deposit ({DEPOSIT_PERCENT}%)</p><p className="mt-1 font-medium">{inr(state.booking.depositAmount ?? getDepositAmount(state.booking.totalAmount))}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-ink/50">Balance due later</p><p className="mt-1 font-medium">{inr(state.booking.balanceDue ?? state.booking.totalAmount - (state.booking.depositAmount ?? getDepositAmount(state.booking.totalAmount)))}</p></div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">Booked by</p>
                <p className="mt-1 font-medium">{state.booking.customer.name}</p>
                <p className="text-sm text-ink/60">{state.booking.customer.phone} · {state.booking.customer.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-mangrove/10 px-3 py-1.5 capitalize text-mangrove">Booking: {state.booking.bookingStatus}</span>
                <span className="rounded-full bg-gold/15 px-3 py-1.5 capitalize text-forest">
                  Payment: {state.booking.paymentStatus === "paid" ? "deposit received" : state.booking.paymentStatus}
                </span>
              </div>
              {state.booking.paymentStatus === "unpaid" && (
                <section className="space-y-3 rounded-2xl bg-sand/50 p-5 text-center">
                  <h2 className="font-semibold text-forest">Pay your {DEPOSIT_PERCENT}% deposit by UPI</h2>
                  <p className="text-sm text-ink/65">Scan this QR code with your UPI app and pay {inr(state.booking.depositAmount ?? getDepositAmount(state.booking.totalAmount))}.</p>
                  {qrUnavailable
                    ? <p role="alert" className="rounded-xl bg-white p-6 text-sm text-ink/60">Payment QR image is not uploaded yet. Please contact us on WhatsApp to pay.</p>
                    : <Image
                        src="/payment-qr.png"
                        alt="UPI payment QR code"
                        width={240}
                        height={240}
                        className="mx-auto rounded-lg bg-white object-contain"
                        unoptimized
                        onError={() => setQrUnavailable(true)}
                      />}
                  <p className="text-xs text-ink/60">After paying, share your payment confirmation with us on WhatsApp.</p>
                  <a
                    href={`https://wa.me/918220913943?text=${encodeURIComponent(`Hi, I paid the ${DEPOSIT_PERCENT}% deposit for booking ${state.booking.bookingNumber}. Please confirm my payment.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Send payment confirmation
                  </a>
                </section>
              )}
              {state.booking.paymentStatus === "paid" && state.booking.balanceDue !== undefined && state.booking.balanceDue > 0 && (
                <p className="text-sm text-mangrove">Deposit received. {inr(state.booking.balanceDue)} balance is due later.</p>
              )}
            </section>

            <aside className="flex flex-col items-center gap-3 self-center rounded-2xl bg-sand/50 p-5">
              <QRCodeSVG value={state.booking.bookingNumber} size={160} level="M" />
              <p className="text-xs text-ink/55">Show this code at check-in</p>
            </aside>
          </div>

          <footer className="flex flex-wrap justify-center gap-3 border-t border-black/5 p-5 print:hidden">
            <button onClick={() => window.print()} className="rounded-full border border-forest px-6 py-3 text-sm font-semibold text-forest">Print ticket</button>
            <Link href="/" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Back to home</Link>
          </footer>
        </article>
      )}
    </div>
  );
}
