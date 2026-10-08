import type { BoatPackage } from "@/types";

export interface GuestInput { adults: number; children: number; infants: number; tierId?: string }

export interface PriceBreakdown {
  adultAmount: number;
  childAmount: number;
  subtotal: number;
  discount: number;
  total: number;
  totalGuests: number;
  seats: number;
  tierLabel?: string;
}

export function calculatePrice(pkg: BoatPackage, g: GuestInput): PriceBreakdown {
  const totalGuests = g.adults + g.children + g.infants;
  const seats = g.adults + g.children; // infants under 2 take no seat

  if (pkg.type === "private") {
    const tier = pkg.privateTiers?.find((t) => t.id === g.tierId);
    if (!tier) throw new Error("Select a private charter capacity.");
    if (totalGuests < 1 || totalGuests > tier.maxGuests) throw new Error(`This charter allows up to ${tier.maxGuests} guests.`);
    return { adultAmount: tier.price, childAmount: 0, subtotal: tier.price, discount: 0, total: tier.price, totalGuests, seats, tierLabel: tier.label };
  }

  const price = pkg.pricePerPerson ?? 0;
  const list = pkg.listPricePerPerson ?? price;
  if (pkg.minGuests && seats < pkg.minGuests) throw new Error(`Minimum ${pkg.minGuests} guests for this package.`);

  const adultAmount = g.adults * price;
  const childAmount = g.children * (price / 2);
  const subtotal = g.adults * list + g.children * (list / 2);
  const discount = subtotal - (adultAmount + childAmount);
  return { adultAmount, childAmount, subtotal, discount, total: adultAmount + childAmount, totalGuests, seats };
}

export const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);