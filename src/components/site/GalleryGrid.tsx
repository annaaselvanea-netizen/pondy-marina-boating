// src/components/site/GalleryGrid.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { GalleryItem } from "@/types";

export default function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  useEffect(() => {
    getDocs(query(collection(db, "gallery"), where("isActive", "==", true)))
      .then((s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem)))
      .catch(() => setItems([]));
  }, []);

  if (!items) return <div className="columns-2 gap-4 lg:columns-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="mb-4 h-56 animate-pulse rounded-2xl bg-sand-deep/60" />)}</div>;
  if (!items.length) return <p className="py-20 text-center text-ink/60">Our gallery is being curated. Check back soon.</p>;
  return (
    <div className="columns-2 gap-4 lg:columns-3">
      {items.map((g) => (
        <figure key={g.id} className="group relative mb-4 overflow-hidden rounded-2xl">
          <Image src={g.imageUrl} alt={g.title} width={800} height={600} sizes="(min-width:1024px) 33vw, 50vw" className="h-auto w-full transition duration-700 group-hover:scale-105" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 text-sm text-white opacity-0 transition group-hover:opacity-100">{g.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}