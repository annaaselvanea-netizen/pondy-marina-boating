import Hero from "@/components/site/Hero";
import DestinationCard from "@/components/site/DestinationCard";
import JourneyTimeline from "@/components/site/JourneyTimeline";
import PackagesSection from "@/components/site/PackagesSection";
import Reveal from "@/components/site/Reveal";
import FAQ from "@/components/site/FAQ";
import { DESTINATIONS } from "@/data/seed-packages";
import Link from "next/link";
import { Leaf, ShieldCheck, Users, Heart } from "lucide-react";

const WHY = [
  [Leaf, "Eco-conscious", "Low-impact cruising that protects the mangroves."],
  [ShieldCheck, "Safety first", "Life jackets for every guest and trained local guides."],
  [Users, "Family friendly", "Fair child pricing and an easy, calm route."],
  [Heart, "Made for moments", "Proposals, anniversaries and golden-hour photos."],
] as const;

export default function Home() {
  return (
    <>
      <Hero />
      <section id="journey" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ocean">Four Wonders. One Voyage.</p>
          <h2 className="mt-3 font-serif text-4xl text-forest sm:text-6xl">Four destinations, one boat</h2>
          <p className="mt-5 text-lg text-ink/70">From whispering mangroves to a 2,000-year-old trading port, every minute on the water tells a different story.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((d, i) => <Reveal key={d.n} delay={i * 100}><DestinationCard {...d} /></Reveal>)}
        </div>
      </section>

      <JourneyTimeline />
      <PackagesSection />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {WHY.map(([Icon, t, d]) => (
            <Reveal key={t}>
              <Icon className="size-9 text-mangrove" aria-hidden />
              <h3 className="mt-4 font-serif text-2xl text-forest">{t}</h3>
              <p className="mt-2 text-sm text-ink/70">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FAQ />

      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-mangrove to-ocean-deep py-24 text-center text-white">
        <h2 className="mx-auto max-w-3xl px-5 font-serif text-4xl sm:text-6xl">Your boat is waiting at the water's edge.</h2>
        <Link href="/booking" className="mt-9 inline-block rounded-full bg-gold px-10 py-4 font-semibold text-forest transition hover:bg-white">Book Your Boating</Link>
      </section>
    </>
  );
}