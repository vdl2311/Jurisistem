import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'pro-bolso' });
const db = getFirestore(app);

async function test() {
  try {
    const snap = await db.collection('User').limit(1).get();
    console.log("Admin success:", snap.size);
  } catch (e: any) {
    console.error("Admin error:", e.message);
  }
}
test();
