import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, requireAdmin } from "@/lib/firebase/admin";
import { getDepositAmount } from "@/lib/payments";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(req); } catch (r) { return r as Response; }
  const { id } = await params;
  const { bookingStatus, paymentStatus } = await req.json();
  if (bookingStatus && !STATUSES.includes(bookingStatus)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (paymentStatus !== undefined && !["unpaid", "paid", "refunded"].includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  await adminDb.runTransaction(async (tx) => {
    const ref = adminDb.collection("bookings").doc(id);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("Not found");
    const b = snap.data()!;
    const slotRef = adminDb.collection("timeSlots").doc(b.slotId);
    if (bookingStatus === "cancelled" && b.bookingStatus !== "cancelled") {
      tx.update(slotRef, { bookedCount: FieldValue.increment(-b.seatsHeld) });
    }
    tx.update(ref, {
      ...(bookingStatus && { bookingStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(paymentStatus === "paid" && {
        paidAmount: b.depositAmount ?? getDepositAmount(b.totalAmount),
        balanceDue: b.balanceDue ?? b.totalAmount - getDepositAmount(b.totalAmount),
      }),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
  return NextResponse.json({ ok: true });
}