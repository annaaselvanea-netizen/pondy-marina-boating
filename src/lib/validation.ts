import { z } from "zod";

export const bookingSchema = z.object({
  packageId: z.string().min(1),
  tierId: z.string().optional(),
  slotId: z.string().min(1),
  adults: z.number().int().min(0).max(60),
  children: z.number().int().min(0).max(60),
  infants: z.number().int().min(0).max(20),
  customer: z.object({
    name: z.string().trim().min(2, "Enter your full name").max(80),
    phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
    email: z.string().trim().email("Enter a valid email"),
  }),
  notes: z.string().trim().max(500).default(""),
}).refine((v) => v.adults + v.children >= 1, { message: "At least one paying guest is required", path: ["adults"] });

export type BookingInput = z.infer<typeof bookingSchema>;