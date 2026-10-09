import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-forest pb-28 pt-16 text-sand/80 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-3xl text-white">Pondy Mangrove Boating</p>
          <p className="mt-3 max-w-xs text-sm">Four Wonders. One Voyage. Premium eco-tourism boating in Pondicherry.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {[["Experience", "/experience"], ["Packages", "/packages"], ["Book", "/booking"], ["Gallery", "/gallery"], ["Contact", "/contact"]].map(([l, h]) => (
            <Link key={h} href={h} className="hover:text-gold">{l}</Link>
          ))}
        </nav>
        <p className="text-sm">Puducherry, India<br />WhatsApp: +{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
      </div>
      <p className="mt-12 text-center text-xs text-sand/50">© {new Date().getFullYear()} Pondy Mangrove Boating</p>
    </footer>
  );
}