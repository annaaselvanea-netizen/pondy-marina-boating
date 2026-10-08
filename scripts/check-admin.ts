import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

(async () => {
  const email = process.argv[2];
  console.log("Admin SDK project:", process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log("Web app project  :", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const user = await getAuth().getUserByEmail(email);
  console.log("User:", user.email, "| uid:", user.uid);
  console.log("Custom claims:", user.customClaims ?? "(none)");
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });