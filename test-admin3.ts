import { initializeApp, getApps, credential } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ 
  projectId: 'pro-bolso',
  credential: credential.applicationDefault()
});
const db = getFirestore(app, 'ai-studio-novojurisflowai-db334b18-587d-4f73-8e58-8de428ca2db8');

async function test() {
  try {
    const snap = await db.collection('User').limit(1).get();
    console.log("Admin success:", snap.size);
  } catch (e: any) {
    console.error("Admin error:", e.message);
  }
}
test();
