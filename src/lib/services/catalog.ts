import { collection, doc, getDocs, orderBy, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { BoatPackage, TimeSlot } from "@/types";
import { SEED_PACKAGES } from "@/data/seed-packages";

export async function getActivePackages(): Promise<BoatPackage[]> {
  try {
    const snap = await getDocs(query(collection(db, "packages"), where("isActive", "==", true)));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BoatPackage).sort((a, b) => a.sortOrder - b.sortOrder);
    return list.length ? list : SEED_PACKAGES; // fallback until Firestore is seeded
  } catch {
    return SEED_PACKAGES;
  }
}

export async function getSlotsForDate(date: string): Promise<TimeSlot[]> {
  const snap = await getDocs(query(collection(db, "timeSlots"), where("date", "==", date), where("isActive", "==", true)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimeSlot).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

// ---- admin ----
export const createSlot = (s: Omit<TimeSlot, "id" | "bookedCount">) =>
  addDoc(collection(db, "timeSlots"), { ...s, bookedCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateSlot = (id: string, data: Partial<TimeSlot>) =>
  updateDoc(doc(db, "timeSlots", id), { ...data, updatedAt: serverTimestamp() });
export const savePackage = (id: string | null, data: Partial<BoatPackage>) =>
  id ? updateDoc(doc(db, "packages", id), { ...data, updatedAt: serverTimestamp() })
     : addDoc(collection(db, "packages"), { ...data, createdAt: serverTimestamp() });
export const deletePackage = (id: string) => deleteDoc(doc(db, "packages", id));
export { orderBy };