import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import GalleryGrid from "@/components/site/GalleryGrid";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Moments on the water" />
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <GalleryGrid />
      </section>
    </>
  );
}