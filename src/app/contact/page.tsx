import type { Metadata } from "next";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <>
      <PageHeader eyebrow="Contact" title="We'd love to hear from you" text="Questions, group enquiries or special occasions: message us anytime." />
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi Pondy Marina Boating, I'd like to know more.")}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-4 rounded-3xl bg-[#25D366] p-6 text-white shadow-lg transition hover:-translate-y-0.5">
            <MessageCircle className="size-8" aria-hidden />
            <span><span className="block font-serif text-2xl">Chat on WhatsApp</span><span className="text-sm opacity-90">Fastest way to reach us</span></span>
          </a>
          <div className="flex gap-4 rounded-3xl bg-white p-6 shadow-sm">
            <MapPin className="mt-1 size-6 shrink-0 text-mangrove" aria-hidden />
            <p><span className="font-serif text-xl text-forest">Find us</span><br /><span className="text-sm text-ink/70">Puducherry, India. Add your exact jetty address later.</span></p>
          </div>
          <div className="flex gap-4 rounded-3xl bg-white p-6 shadow-sm">
            <Clock className="mt-1 size-6 shrink-0 text-mangrove" aria-hidden />
            <p><span className="font-serif text-xl text-forest">Duration</span><br /><span className="text-sm text-ink/70">Every cruise is 1 hour. Arrive 15 minutes early.</span></p>
          </div>
        </div>
        <iframe title="Pondicherry map" loading="lazy" className="h-96 w-full rounded-3xl border-0 shadow-lg lg:h-full"
          src="https://www.google.com/maps?q=Puducherry&output=embed" />
      </section>
    </>
  );
}