export default function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <header className="relative isolate overflow-hidden bg-forest px-5 pb-20 pt-36 text-center text-white grain">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_50%_0%,rgba(79,154,115,.35),transparent)]" />
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
      <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl sm:text-6xl">{title}</h1>
      {text && <p className="mx-auto mt-5 max-w-xl text-lg text-sand/85">{text}</p>}
    </header>
  );
}