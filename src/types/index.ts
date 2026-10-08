import type { Timestamp } from "firebase/firestore";

export type PackageType = "group" | "private" | "bulk";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface PrivateTier {
  id: string;
  label: string;
  minGuests: number;
  maxGuests: number;
  price: number;
}

export interface BoatPackage {
  id: string;
  name: string;
  slug: string;
  type: PackageType;
  description: string;
  features: string[];
  pricePerPerson?: number;      // group / bulk
  listPricePerPerson?: number;  // used to show bulk discount
  minGuests?: number;
  privateTiers?: PrivateTier[]; // private only
  agePolicy?: string[];
  ctaLabel: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface TimeSlot {
  id: string;
  date: string;       // YYYY-MM-DD (IST)
  startTime: string;  // HH:mm
  endTime: string;
  capacity: number;
  bookedCount: number;
  isActive: boolean;
  tag?: "sunrise" | "golden-hour" | null;
}

export interface Customer { name: string; phone: string; email: string }

export interface Booking {
  id: string;
  bookingNumber: string;
  accessToken: string;
  packageId: string;
  packageName: string;
  packageType: PackageType;
  tierLabel?: string;
  slotId: string;
  customer: Customer;
  date: string;
  time: string;
  adults: number;
  children: number;
  infants: number;
  totalGuests: number;
  seatsHeld: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  depositAmount?: number;
  paidAmount?: number;
  balanceDue?: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  qrCode: string;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string; name: string; rating: number; comment: string;
  status: "pending" | "approved" | "rejected"; createdAt: Timestamp;
}

export interface GalleryItem {
  id: string; title: string; category: string; imageUrl: string;
  storagePath: string; isActive: boolean; createdAt: Timestamp;
}