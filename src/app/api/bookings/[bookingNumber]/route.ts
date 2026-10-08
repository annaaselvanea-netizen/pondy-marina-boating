import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: Request, { params }: { params: Promise<{ bookingNumber: string }> }) {
  const { bookingNumber } = await params;
  const token = new URL(req.url).searchParams.get("t");
  const snap = await adminDb.collection("bookings").where("bookingNumber", "==", bookingNumber).limit(1).get();
  const doc = snap.docs[0];
  if (!doc || !token || doc.data().accessToken !== token) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const booking = doc.data();
  return NextResponse.json({
    bookingNumber: booking.bookingNumber,
    packageName: booking.packageName,
    tierLabel: booking.tierLabel ?? null,
    date: booking.date,
    time: booking.time,
    adults: booking.adults,
    children: booking.children,
    infants: booking.infants,
    totalGuests: booking.totalGuests,
    totalAmount: booking.totalAmount,
    depositAmount: booking.depositAmount,
    paidAmount: booking.paidAmount ?? 0,
    balanceDue: booking.balanceDue,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
    customer: booking.customer,
  });
}