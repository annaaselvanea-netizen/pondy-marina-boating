import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import PackagesSection from "@/components/site/PackagesSection";

export const metadata: Metadata = { title: "Packages & Pricing" };

export default function PackagesPage() {
  return (
    <>
      <PageHeader eyebrow="Packages" title="Choose how you want to sail" text="Shared rides, private charters and group bookings." />
      <PackagesSection />
    </>
  );
}