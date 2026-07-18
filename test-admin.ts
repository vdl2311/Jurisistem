import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'pro-bolso' });
const db = getFirestore(app, 'ai-studio-novojurisflowai-db334b18-587d-4f73-8e58-8de428ca2db8');

async function test() {
  try {
    console.log("=== COLLECTION 'User' ===");
    const snapUserUpper = await db.collection('User').get();
    console.log("Size:", snapUserUpper.size);
    snapUserUpper.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });

    console.log("\n=== COLLECTION 'user' ===");
    const snapUserLower = await db.collection('user').get();
    console.log("Size:", snapUserLower.size);
    snapUserLower.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (e: any) {
    console.error("Admin error:", e.message);
  }
}
test();
