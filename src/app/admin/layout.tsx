"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-forest px-5">
      <form onSubmit={async (e) => { e.preventDefault(); try { await signInWithEmailAndPassword(auth, email, pw); } catch { setErr("Invalid email or password."); } }}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="font-serif text-3xl text-forest">Admin sign in</h1>
        <label className="block text-sm">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3" /></label>
        <label className="block text-sm">Password<input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3" /></label>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-forest py-3 font-semibold text-white">Sign in</button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAdminAuth();
  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <Login />;
  if (!isAdmin) return (
    <div className="grid min-h-screen place-items-center text-center">
      <div><p className="font-serif text-2xl">Access denied</p><button className="mt-4 underline" onClick={() => signOut(auth)}>Sign out</button></div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#f6f5f0] md:flex">
      <AdminSidebar />
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8">{children}</div>
    </div>
  );
}