import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { bookingSchema } from "@/lib/validation";
import { calculatePrice } from "@/lib/pricing";
import { getDepositAmount } from "@/lib/payments";
import type { BoatPackage, TimeSlot } from "@/types";

class BookingError extends Error {
  constructor(message: string, public status = 409) { super(message); }
}

export async function POST(req: Request) {
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const input = parsed.data;

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const slotRef = adminDb.collection("timeSlots").doc(input.slotId);
      const pkgRef = adminDb.collection("packages").doc(input.packageId);
      const slotSnap = await tx.get(slotRef);
      const pkgSnap = await tx.get(pkgRef);
      if (!slotSnap.exists || !pkgSnap.exists) throw new BookingError("Slot or package not found.", 404);

      const slot = { id: slotSnap.id, ...slotSnap.data() } as TimeSlot;
      const pkg = { id: pkgSnap.id, ...pkgSnap.data() } as BoatPackage;
      if (!slot.isActive || !pkg.isActive) throw new BookingError("This slot is no longer available.");
      if (new Date(`${slot.date}T${slot.startTime}:00+05:30`).getTime() < Date.now()) throw new BookingError("This slot has already departed.");

      let price;
      try { price = calculatePrice(pkg, input); }
      catch (e) { throw new BookingError((e as Error).message, 400); }

      // Private charters take the whole boat. Shared packages take seats.
      const isPrivate = pkg.type === "private";
      const remaining = slot.capacity - slot.bookedCount;
      if (isPrivate && slot.bookedCount > 0) throw new BookingError("This slot already has bookings, so it can't be a private charter. Pick another time.");
      if (!isPrivate && price.seats > remaining) throw new BookingError(remaining <= 0 ? "This slot is fully booked." : `Only ${remaining} seat(s) left in this slot.`);
      const seatsHeld = isPrivate ? slot.capacity : price.seats;

      const dateKey = slot.date.replaceAll("-", "");
      const counterRef = adminDb.collection("settings").doc(`counter-${dateKey}`);
      const phone = input.customer.phone.replace(/^\+91/, "");
      const customerRef = adminDb.collection("customers").doc(phone);
      const counterSnap = await tx.get(counterRef);
      const customerSnap = await tx.get(customerRef);

      const next = (counterSnap.data()?.next ?? 0) + 1;
      const bookingNumber = `PMB-${dateKey}-${String(next).padStart(5, "0")}`;
      const bookingRef = adminDb.collection("bookings").doc();
      const accessToken = randomBytes(12).toString("hex");
      const depositAmount = getDepositAmount(price.total);

      // ----- writes -----
      tx.update(slotRef, { bookedCount: FieldValue.increment(seatsHeld), updatedAt: FieldValue.serverTimestamp() });
      tx.set(counterRef, { next }, { merge: true });
      tx.set(bookingRef, {
        bookingNumber, accessToken,
        packageId: pkg.id, packageName: pkg.name, packageType: pkg.type,
        tierLabel: price.tierLabel ?? null,
        slotId: slot.id,
        customer: { ...input.customer, phone },
        date: slot.date, time: `${slot.startTime} – ${slot.endTime}`,
        adults: input.adults, children: input.children, infants: input.infants,
        totalGuests: price.totalGuests, seatsHeld,
        subtotal: price.subtotal, discount: price.discount, totalAmount: price.total,
        depositAmount, balanceDue: price.total - depositAmount, paidAmount: 0,
        paymentStatus: "unpaid", bookingStatus: "confirmed",
        qrCode: bookingNumber, notes: input.notes,
        createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
      });
      tx.set(customerRef, {
        name: input.customer.name, phone, email: input.customer.email,
        totalBookings: FieldValue.increment(1), totalSpent: FieldValue.increment(price.total),
        lastBookingAt: FieldValue.serverTimestamp(),
        ...(customerSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      }, { merge: true });

      return { bookingNumber, accessToken };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof BookingError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("Booking failed", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}