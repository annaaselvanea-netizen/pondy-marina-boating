"use client";

import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/use-auth";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="font-serif text-4xl text-forest">Settings</h1><p className="mt-2 text-sm text-ink/60">Manage your current admin session.</p></div>
      <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="text-lg font-semibold">Admin account</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="text-ink/55">Signed in as</dt><dd className="break-all">{user?.email ?? "—"}</dd>
          <dt className="text-ink/55">Account ID</dt><dd className="break-all font-mono text-xs">{user?.uid ?? "—"}</dd>
          <dt className="text-ink/55">Access</dt><dd>Admin</dd>
        </dl>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"><LogOut className="size-4" />Sign out</button>
      </section>
    </div>
  );
}
