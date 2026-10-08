"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function useAdminAuth() {
  const [state, setState] = useState<{ user: User | null; isAdmin: boolean; loading: boolean }>({ user: null, isAdmin: false, loading: true });
  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) return setState({ user: null, isAdmin: false, loading: false });
    const t = await user.getIdTokenResult(true);
    setState({ user, isAdmin: t.claims.admin === true, loading: false });
  }), []);
  return state;
}