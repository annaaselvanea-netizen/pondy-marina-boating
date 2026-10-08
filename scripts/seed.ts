import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { SEED_PACKAGES } from "../src/data/seed-packages";

const { FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY } = process.env;
if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error("Missing FIREBASE_ADMIN_* values in .env.local");
  process.exit(1);
}

const privateKey = FIREBASE_ADMIN_PRIVATE_KEY.trim()
  .replace(/^['"]|['"][,]?$/g, "")
  .replace(/\\n/g, "\n");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}
const db = getFirestore();

async function main() {
  for (const { id, ...pkg } of SEED_PACKAGES) {
    await db.collection("packages").doc(id).set({ ...pkg, createdAt: FieldValue.serverTimestamp() });
    console.log(`Seeded package: ${pkg.name}`);
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });