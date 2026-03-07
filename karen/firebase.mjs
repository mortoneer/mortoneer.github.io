// Firebase integration
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

let db = null;

export function initFirebase(app, sceneManager) {
  db = getDatabase(app);
  
  onValue(ref(db, 'karen/scenes'), (snapshot) => {
    const firebaseData = snapshot.val();
    if (!firebaseData) return;
    
    const localData = localStorage.getItem('karen-scenes');
    const local = localData ? JSON.parse(localData) : { scenes: [], timestamp: 0 };
    local.timestamp = local.timestamp || -1;
    firebaseData.timestamp = firebaseData.timestamp || 0;
    
    if (firebaseData.timestamp > local.timestamp) {
      console.log('[Firebase] Remote is newer, updating local');
      localStorage.setItem('karen-scenes', JSON.stringify(firebaseData));
      sceneManager.scenes = firebaseData.scenes;
      window.dispatchEvent(new Event('scenes-updated'));
    } else {
      console.log('[Firebase] Local is newer, keeping local');
    }
  });
}

async function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

export async function saveToFirebase(data) {
  if (!db) throw new Error('Firebase not initialized');
  if (!window.currentUser) throw new Error('Not logged in');
  
  await withTimeout(set(ref(db, 'karen/scenes'), data));
  console.log('[Firebase] Saved');
  window.dispatchEvent(new Event('firebase-synced'));
}
