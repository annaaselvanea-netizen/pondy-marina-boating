import Image from "next/image";
import { Check } from "lucide-react";

interface Props { n: string; name: string; text: string; img: string; highlights: readonly string[]; flip?: boolean }

export default function DestinationCard({ n, name, text, img, highlights }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-forest text-white shadow-xl shadow-forest/20 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
        <Image src={img} alt={name} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-[900ms] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/50 to-transparent" />
        <span className="absolute left-5 top-4 font-serif text-6xl font-semibold text-white/30">{n}</span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-serif text-3xl leading-tight">{name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-sand/85 line-clamp-4 group-hover:line-clamp-none">{text}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li key={h} className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 text-xs backdrop-blur">
                <Check className="size-3 text-gold" aria-hidden />{h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}