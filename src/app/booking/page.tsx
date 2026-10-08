import { Suspense } from "react";
import type { Metadata } from "next";
import BookingStepper from "@/components/booking/BookingStepper";

export const metadata: Metadata = { title: "Book Your Boating" };

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-40 text-center text-ink/60">Loading booking…</div>}>
      <BookingStepper />
    </Suspense>
  );
}