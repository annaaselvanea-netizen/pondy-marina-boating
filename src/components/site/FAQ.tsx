const ITEMS = [
  ["How long is the boat ride?", "The full journey is 1 hour, covering the mangrove forest, river mouth, Arikamedu and the fishing harbour."],
  ["What is the child ticket policy?", "Below 2 years is free, ages 2–4 pay half, and age 5 and above pay a full ticket."],
  ["Is the private boat really private?", "Yes. A private charter reserves the entire boat for your group, with no other guests."],
  ["Can I cancel or change my booking?", "Contact us on WhatsApp with your booking number and we'll help you reschedule."],
  ["What should I carry?", "Sun protection, a hat, your camera and comfortable footwear. Life jackets are provided."],
] as const;

export default function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24" aria-labelledby="faq-h">
      <h2 id="faq-h" className="text-center font-serif text-4xl text-forest sm:text-5xl">Good to know</h2>
      <div className="mt-10 divide-y divide-sand-deep rounded-3xl bg-white px-6 shadow-sm">
        {ITEMS.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-forest">
              {q}<span aria-hidden className="text-2xl text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}