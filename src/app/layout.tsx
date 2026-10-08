import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cormorant" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Pondy Marina Boating | Mangrove, River Mouth, Arikamedu & Fishing Harbour", template: "%s | Pondy Marina Boating" },
  description: "One boat, four destinations. A 1-hour eco-tourism boating journey in Pondicherry through mangroves, the river mouth, Arikamedu and the fishing harbour.",
  openGraph: { title: "Pondy Marina Boating", description: "Four Wonders. One Voyage.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(serif.variable, sans.variable, "font-sans", geist.variable)}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <StickyCTA />
        <WhatsAppButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}