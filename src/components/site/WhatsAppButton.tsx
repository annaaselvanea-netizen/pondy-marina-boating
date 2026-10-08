"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/918220913943?text=Hi%2C%20I%20have%20an%20enquiry%20about%20Pondy%20Marina%20Boating.";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Send an enquiry on WhatsApp"
      className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1fb85a] md:bottom-6 md:right-6"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="text-sm">WhatsApp</span>
    </a>
  );
}
