import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ?.trim()
  .replace(/^["']|["'][,]?$/g, "")
  .replace(/\\n/g, "\n");

const app = getApps()[0] ?? initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey,
  }),
});

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Response("Unauthorized", { status: 401 });
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
  if (!decoded || decoded.admin !== true) throw new Response("Forbidden", { status: 403 });
  return decoded;
}