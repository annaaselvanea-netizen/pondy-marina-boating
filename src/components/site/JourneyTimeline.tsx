import Reveal from "./Reveal";

const STOPS = [
  { t: "0 min", name: "Mangrove Forest", note: "Glide through green tunnels" },
  { t: "~20 min", name: "River Mouth", note: "River meets the Bay of Bengal" },
  { t: "~40 min", name: "Arikamedu", note: "2,000-year-old Indo-Roman port" },
  { t: "~55 min", name: "Fishing Harbour", note: "Colour, boats and fishermen" },
];

export default function JourneyTimeline() {
  return (
    <section className="bg-forest py-24 text-white" aria-labelledby="timeline-h">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal><h2 id="timeline-h" className="text-center font-serif text-4xl sm:text-5xl">Your 60 minutes on the water</h2></Reveal>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-4">
          <span aria-hidden className="absolute left-[1.15rem] top-2 h-full w-px bg-gradient-to-b from-gold to-transparent md:left-0 md:top-[1.15rem] md:h-px md:w-full md:bg-gradient-to-r" />
          {STOPS.map((s, i) => (
            <Reveal key={s.name} delay={i * 120}>
              <li className="relative pl-12 md:pl-0 md:pt-12">
                <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full bg-gold font-serif text-lg font-bold text-forest ring-8 ring-forest md:left-0">{i + 1}</span>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{s.t}</p>
                <h3 className="mt-1 font-serif text-2xl">{s.name}</h3>
                <p className="mt-1 text-sm text-sand/75">{s.note}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}