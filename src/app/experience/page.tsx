import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import DestinationCard from "@/components/site/DestinationCard";
import JourneyTimeline from "@/components/site/JourneyTimeline";
import Reveal from "@/components/site/Reveal";
import { DESTINATIONS } from "@/data/seed-packages";

export const metadata: Metadata = { title: "The Experience" };

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Four Wonders. One Voyage."
        title="One boat. Four destinations."
        text="Mangrove tunnels, the Bay of Bengal, a 2,000-year-old trading port and a living fishing harbour, all in 60 minutes."
      />
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.n} delay={i * 100}>
              <DestinationCard {...d} />
            </Reveal>
          ))}
        </div>
      </section>
      <JourneyTimeline />
      <section className="py-20 text-center">
        <Link href="/booking" className="inline-block rounded-full bg-forest px-10 py-4 font-semibold text-white transition hover:bg-mangrove">
          Book Your Boating
        </Link>
      </section>
    </>
  );
}