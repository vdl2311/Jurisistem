import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

async function test() {
  console.log("Testing (default) database...");
  try {
    const app = initializeApp(firebaseConfig);
    const dbDefault = initializeFirestore(app, {});
    const snap = await getDocs(collection(dbDefault, 'test'));
    console.log("Success with (default) database, size:", snap.size);
  } catch (e: any) {
    console.error("Failed with (default) database:", e.message);
  }

  console.log("Testing custom database...");
  try {
    const app = initializeApp(firebaseConfig, 'custom');
    const dbCustom = initializeFirestore(app, {
      databaseId: firebaseConfig.firestoreDatabaseId
    });
    const snap = await getDocs(collection(dbCustom, 'test'));
    console.log("Success with custom database, size:", snap.size);
  } catch (e: any) {
    console.error("Failed with custom database:", e.message);
  }
}

test();
