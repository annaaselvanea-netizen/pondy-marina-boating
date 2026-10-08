"use client";

import { useEffect, useState, type FormEvent } from "react";
import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { deletePackage, savePackage } from "@/lib/services/catalog";
import { inr } from "@/lib/pricing";
import type { BoatPackage, PackageType, PrivateTier } from "@/types";

type PackageForm = {
  name: string;
  slug: string;
  type: PackageType;
  description: string;
  features: string;
  pricePerPerson: string;
  listPricePerPerson: string;
  minGuests: string;
  privateTiers: string;
  ctaLabel: string;
  imageUrl: string;
  sortOrder: string;
  isActive: boolean;
};

const blankForm: PackageForm = {
  name: "",
  slug: "",
  type: "group",
  description: "",
  features: "",
  pricePerPerson: "",
  listPricePerPerson: "",
  minGuests: "",
  privateTiers: "[]",
  ctaLabel: "Book now",
  imageUrl: "",
  sortOrder: "0",
  isActive: true,
};

function toForm(pkg: BoatPackage): PackageForm {
  return {
    name: pkg.name,
    slug: pkg.slug,
    type: pkg.type,
    description: pkg.description,
    features: pkg.features.join("\n"),
    pricePerPerson: pkg.pricePerPerson?.toString() ?? "",
    listPricePerPerson: pkg.listPricePerPerson?.toString() ?? "",
    minGuests: pkg.minGuests?.toString() ?? "",
    privateTiers: JSON.stringify(pkg.privateTiers ?? [], null, 2),
    ctaLabel: pkg.ctaLabel,
    imageUrl: pkg.imageUrl ?? "",
    sortOrder: pkg.sortOrder.toString(),
    isActive: pkg.isActive,
  };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<BoatPackage[] | null>(null);
  const [form, setForm] = useState<PackageForm>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadPackages() {
    const snapshot = await getDocs(collection(db, "packages"));
    setPackages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as BoatPackage)
      .sort((a, b) => a.sortOrder - b.sortOrder));
  }

  useEffect(() => {
    let active = true;
    getDocs(collection(db, "packages")).then((snapshot) => {
      if (!active) return;
      setPackages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as BoatPackage)
        .sort((a, b) => a.sortOrder - b.sortOrder));
    }).catch((error: unknown) => {
      if (!active) return;
      toast.error(error instanceof Error ? error.message : "Could not load packages.");
      setPackages([]);
    });
    return () => { active = false; };
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(blankForm);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = form.pricePerPerson ? Number(form.pricePerPerson) : undefined;
    const listPrice = form.listPricePerPerson ? Number(form.listPricePerPerson) : price;
    const minGuests = form.minGuests ? Number(form.minGuests) : undefined;
    const sortOrder = Number(form.sortOrder);
    let privateTiers: PrivateTier[] | undefined;

    if (form.type === "private") {
      try {
        privateTiers = JSON.parse(form.privateTiers) as PrivateTier[];
      } catch {
        toast.error("Private tiers must be valid JSON.");
        return;
      }
      if (!Array.isArray(privateTiers) || privateTiers.some((tier) =>
        !tier.id || !tier.label || !Number.isFinite(tier.minGuests) ||
        !Number.isFinite(tier.maxGuests) || !Number.isFinite(tier.price))) {
        toast.error("Each private tier needs an id, label, guest limits, and price.");
        return;
      }
    }

    if ((price !== undefined && (!Number.isFinite(price) || price < 0)) ||
        (listPrice !== undefined && (!Number.isFinite(listPrice) || listPrice < 0)) ||
        (minGuests !== undefined && (!Number.isInteger(minGuests) || minGuests < 1)) ||
        !Number.isFinite(sortOrder)) {
      toast.error("Check the package prices, minimum guests, and display order.");
      return;
    }

    const data: Partial<BoatPackage> = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      description: form.description.trim(),
      features: form.features.split("\n").map((feature) => feature.trim()).filter(Boolean),
      pricePerPerson: form.type === "private" ? undefined : price,
      listPricePerPerson: form.type === "private" ? undefined : listPrice,
      minGuests: form.type === "private" ? undefined : minGuests,
      privateTiers: form.type === "private" ? privateTiers : undefined,
      ctaLabel: form.ctaLabel.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
      sortOrder,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      await savePackage(editingId, data);
      toast.success(editingId ? "Package updated." : "Package created.");
      resetForm();
      await loadPackages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the package.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(pkg: BoatPackage) {
    try {
      await updateDoc(doc(db, "packages", pkg.id), {
        isActive: !pkg.isActive,
        updatedAt: serverTimestamp(),
      });
      await loadPackages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the package.");
    }
  }

  async function remove(pkg: BoatPackage) {
    if (!confirm(`Delete "${pkg.name}"?`)) return;
    try {
      await deletePackage(pkg.id);
      toast.success("Package deleted.");
      await loadPackages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the package.");
    }
  }

  const inputClass = "mt-1 block w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm";

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-forest">Packages</h1>
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <h2 className="font-semibold">{editingId ? "Edit package" : "Add package"}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Name<input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="text-sm">URL slug<input required className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
          <label className="text-sm">Type<select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PackageType })}><option value="group">Group</option><option value="private">Private</option><option value="bulk">Bulk</option></select></label>
          <label className="text-sm">Button label<input required className={inputClass} value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></label>
          <label className="text-sm sm:col-span-2">Description<textarea required rows={2} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="text-sm sm:col-span-2">Features (one per line)<textarea rows={3} className={inputClass} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></label>
          {form.type === "private" ? (
            <label className="text-sm sm:col-span-2">Private tiers (JSON)<textarea rows={7} className={`${inputClass} font-mono`} value={form.privateTiers} onChange={(e) => setForm({ ...form, privateTiers: e.target.value })} placeholder={'[{"id":"couple","label":"Couple Escape","minGuests":1,"maxGuests":2,"price":3600}]'} /></label>
          ) : (
            <>
              <label className="text-sm">Price per person (INR)<input type="number" min="0" className={inputClass} value={form.pricePerPerson} onChange={(e) => setForm({ ...form, pricePerPerson: e.target.value })} /></label>
              <label className="text-sm">List price per person (INR)<input type="number" min="0" className={inputClass} value={form.listPricePerPerson} onChange={(e) => setForm({ ...form, listPricePerPerson: e.target.value })} /></label>
              <label className="text-sm">Minimum guests<input type="number" min="1" className={inputClass} value={form.minGuests} onChange={(e) => setForm({ ...form, minGuests: e.target.value })} /></label>
            </>
          )}
          <label className="text-sm">Display order<input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></label>
          <label className="text-sm sm:col-span-2">Image URL (optional)<input type="url" className={inputClass} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Visible to customers</label>
        </div>
        <div className="flex gap-3">
          <button disabled={saving} className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editingId ? "Save changes" : "Create package"}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border px-5 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All packages</h2>
        {packages === null && <p className="text-sm text-ink/60">Loading packages…</p>}
        {packages?.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink/60">No packages have been created.</p>}
        {packages?.map((pkg) => (
          <article key={pkg.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div>
              <h3 className="font-medium">{pkg.name}<span className="ml-2 text-xs font-normal text-ink/50">{pkg.type}</span></h3>
              <p className="mt-1 text-sm text-ink/60">{pkg.type === "private" ? `${pkg.privateTiers?.length ?? 0} private tiers` : inr(pkg.pricePerPerson ?? 0) + " / person"} · {pkg.isActive ? "Active" : "Hidden"}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button onClick={() => { setEditingId(pkg.id); setForm(toForm(pkg)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="underline">Edit</button>
              <button onClick={() => toggleActive(pkg)} className="underline">{pkg.isActive ? "Hide" : "Activate"}</button>
              <button onClick={() => remove(pkg)} className="text-red-700 underline">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
