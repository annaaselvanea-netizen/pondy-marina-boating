"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import type { Review } from "@/types";

const statuses: Review["status"][] = ["pending", "approved", "rejected"];

function formatDate(review: Review) {
  return review.createdAt?.toDate
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(review.createdAt.toDate())
    : "—";
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState<"all" | Review["status"]>("all");

  useEffect(() => {
    let active = true;
    getDocs(collection(db, "reviews")).then((snapshot) => {
      if (!active) return;
      setReviews(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Review)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)));
    }).catch((error: unknown) => {
      if (!active) return;
      toast.error(error instanceof Error ? error.message : "Could not load reviews.");
      setReviews([]);
    });
    return () => { active = false; };
  }, []);

  async function setStatus(review: Review, status: Review["status"]) {
    try {
      await updateDoc(doc(db, "reviews", review.id), { status });
      setReviews((current) => current?.map((item) => item.id === review.id ? { ...item, status } : item) ?? null);
      toast.success(`Review ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the review.");
    }
  }

  const visibleReviews = reviews?.filter((review) => filter === "all" || review.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-4xl text-forest">Reviews</h1><p className="mt-2 text-sm text-ink/60">Approve reviews to make them visible to customers.</p></div>
        <label className="text-sm">Show<select className="mt-1 block rounded-xl border border-black/10 px-3 py-2.5" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}><option value="all">All reviews</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
      </div>
      {reviews === null && <p className="rounded-2xl bg-white p-8 text-center text-sm">Loading reviews…</p>}
      {visibleReviews?.length === 0 && <p className="rounded-2xl bg-white p-12 text-center text-sm text-ink/50">No {filter === "all" ? "" : `${filter} `}reviews found.</p>}
      {visibleReviews?.map((review) => (
        <article key={review.id} className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-medium">{review.name || "Guest"}</h2><p className="text-xs text-ink/55">{formatDate(review)}</p></div>
            <div className="text-right"><p aria-label={`${review.rating} out of 5 stars`} className="text-amber-600">{"★".repeat(Math.max(0, Math.min(5, review.rating)))}{"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}</p><p className="text-xs capitalize text-ink/55">{review.status}</p></div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6">{review.comment}</p>
          <div className="flex flex-wrap gap-2">
            {statuses.filter((status) => status !== review.status).map((status) => (
              <button key={status} onClick={() => setStatus(review, status)} className="rounded-full border border-black/10 px-4 py-2 text-xs capitalize hover:bg-black/5">{status}</button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
