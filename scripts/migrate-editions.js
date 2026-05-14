// scripts/migrate-editions.js
// Run with: node scripts/migrate-editions.js
 
require("dotenv").config({ path: ".env" });
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc } = require("firebase/firestore");
 
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
async function migrateEditions() {
  console.log("Connecting to Firestore...");
  const snapshot = await getDocs(collection(db, "Battles"));
 
  console.log(`Found ${snapshot.docs.length} battles. Checking for missing Edition fields...\n`);
 
  let updated = 0;
  let skipped = 0;
 
  for (const battle of snapshot.docs) {
    const data = battle.data();
    if (data.Edition === undefined || data.Edition === null) {
      await updateDoc(doc(db, "Battles", battle.id), { Edition: 10 });
      console.log(`✓ Updated: ${battle.id}`);
      updated++;
    } else {
      skipped++;
    }
  }
 
  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}
 
migrateEditions().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
 