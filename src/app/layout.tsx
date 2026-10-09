import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://pondymangroveboating.com"),
  title: {
    default: "Pondy Mangrove Boating | Mangrove & Backwater Boat Tours in Puducherry",
    template: "%s | Pondy Mangrove Boating",
  },
  description:
    "Official booking for Pondy Mangrove Boating. Explore mangrove tunnels, Arikamedu ancient port, river mouth & fishing harbour. Safe family & private boat tours.",
  keywords: [
    "Pondy mangrove boating",
    "Pondicherry mangrove boat tour",
    "Arikamedu boating",
    "Pondicherry boat ride booking",
    "backwater boating Puducherry",
  ],
  openGraph: {
    title: "Pondy Mangrove Boating | Puducherry Mangrove Tours",
    description: "One Boat. Four Destinations. Mangroves, River Mouth, Arikamedu & Fishing Harbour.",
    url: "https://pondymangroveboating.com",
    siteName: "Pondy Mangrove Boating",
    images: [
      {
        url: "/packages/mangrove-forest.jpg",
        width: 1200,
        height: 630,
        alt: "Mangrove boating Pondicherry",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(serif.variable, sans.variable, "font-sans", geist.variable)}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2"
        >
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