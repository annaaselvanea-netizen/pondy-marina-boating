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
  if (!email) throw new Error("Usage: set-admin <email>");
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`${email} is now an admin. Sign out and sign in again.`);
})().catch((e) => { console.error(e); process.exit(1); });