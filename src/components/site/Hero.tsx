import Link from "next/link";
import { ChevronDown, Clock, MapPin, ShieldCheck } from "lucide-react";

export default function Hero({ video = "/hero.mp4" }: { video?: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest grain">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/70 via-forest/35 to-forest/90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_60%,rgba(11,42,33,.65),transparent)]" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-32 lg:px-8">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.4em] text-gold">
          Pondy Marina Boating · Puducherry
        </p>
        <h1 className="mt-5 max-w-4xl animate-fade-up font-serif text-5xl font-medium leading-[1.02] text-white [animation-delay:120ms] sm:text-7xl lg:text-[5.5rem]">
          One Boat.<br /><em className="text-gold not-italic">Four Destinations.</em><br />One Unforgettable Journey.
        </h1>
        <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-sand/90 [animation-delay:260ms]">
          Explore the mangrove forests, river mouth, ancient Arikamedu and vibrant fishing harbour of Pondicherry.
        </p>
        <div className="mt-10 flex animate-fade-up flex-col gap-4 [animation-delay:380ms] sm:flex-row">
          <Link
            href="/booking"
            className="rounded-full bg-gold px-8 py-4 text-center font-semibold text-forest shadow-xl shadow-gold/20 transition hover:-translate-y-0.5 hover:bg-white"
          >
            Book Your Boating
          </Link>
          <Link
            href="#journey"
            className="rounded-full border border-white/40 bg-white/5 px-8 py-4 text-center font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            Explore the Journey
          </Link>
        </div>

        <ul className="mt-16 grid max-w-2xl animate-fade-up grid-cols-3 gap-3 [animation-delay:520ms]">
          {[[Clock, "1 Hour", "Guided cruise"], [MapPin, "4 Locations", "One route"], [ShieldCheck, "Safety First", "Life jackets"]].map(([Icon, a, b]) => {
            const I = Icon as typeof Clock;
            return (
              <li key={a as string} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
                <I className="mb-2 size-5 text-gold" aria-hidden />
                <p className="font-serif text-xl leading-none">{a as string}</p>
                <p className="mt-1 text-xs text-sand/75">{b as string}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href="#journey"
        aria-label="Scroll to journey"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 text-white/70 md:block"
      >
        <ChevronDown className="size-7 animate-bounce" />
      </a>

      <svg className="absolute inset-x-0 bottom-0 -z-0 h-16 w-full text-sand" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0 40c240 40 480 40 720 0s480-40 720 0v40H0z" />
      </svg>
    </section>
  );
}