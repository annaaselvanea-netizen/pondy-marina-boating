"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { uploadImage, removeImage } from "@/lib/services/storage";
import type { GalleryItem } from "@/types";

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("mangrove"); const [progress, setProgress] = useState<number | null>(null);

  const load = () => getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc"))).then((s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem)));
  useEffect(() => { load(); }, []);

  async function onFile(file?: File) {
    if (!file) return;
    if (!title.trim()) return toast.error("Add a title first.");
    try {
      setProgress(0);
      const { url, path } = await uploadImage(file, "gallery", setProgress);
      await addDoc(collection(db, "gallery"), { title, category, imageUrl: url, storagePath: path, isActive: true, createdAt: serverTimestamp() });
      toast.success("Uploaded"); setTitle(""); load();
    } catch (e) { toast.error((e as Error).message || "Upload failed"); }
    finally { setProgress(null); }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-forest">Gallery</h1>
      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <label className="text-xs">Title<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block rounded-xl border px-3 py-2.5 text-sm" /></label>
        <label className="text-xs">Category<select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block rounded-xl border px-3 py-2.5 text-sm">{["mangrove", "river-mouth", "arikamedu", "fishing-harbour", "guests"].map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="cursor-pointer rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white">{progress !== null ? `Uploading ${progress}%` : "Choose image"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} /></label>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {!items && Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-black/5" />)}
        {items?.length === 0 && <p className="col-span-full py-16 text-center text-ink/50">No images yet.</p>}
        {items?.map((g) => (
          <figure key={g.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <div className="relative aspect-square"><Image src={g.imageUrl} alt={g.title} fill sizes="25vw" className="object-cover" /></div>
            <figcaption className="space-y-2 p-3 text-xs">
              <p className="font-medium">{g.title} <span className="text-ink/50">· {g.category}</span></p>
              <label className="flex items-center gap-2"><input type="checkbox" checked={g.isActive} onChange={(e) => updateDoc(doc(db, "gallery", g.id), { isActive: e.target.checked }).then(load)} />Active</label>
              <button className="text-red-600" onClick={async () => { if (!confirm("Delete this image?")) return; await removeImage(g.storagePath).catch(() => {}); await deleteDoc(doc(db, "gallery", g.id)); load(); }}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}