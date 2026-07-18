import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

async function test() {
  console.log("Testing custom database...");
  try {
    const app = initializeApp(firebaseConfig, 'custom');
    const dbCustom = initializeFirestore(app, {
      databaseId: firebaseConfig.firestoreDatabaseId
    });

    console.log("=== COLLECTION 'User' ===");
    const snapUserUpper = await getDocs(collection(dbCustom, 'User'));
    console.log("Size:", snapUserUpper.size);
    snapUserUpper.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });

    console.log("\n=== COLLECTION 'user' ===");
    const snapUserLower = await getDocs(collection(dbCustom, 'user'));
    console.log("Size:", snapUserLower.size);
    snapUserLower.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });

  } catch (e: any) {
    console.error("Client SDK error:", e.message);
  }
}

test();
