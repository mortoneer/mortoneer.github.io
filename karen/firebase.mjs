// Firebase integration
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

let db = null;

export function initFirebase(app) {
  db = getDatabase(app);
  
  // Load scenes from Firebase on init
  onValue(ref(db, 'karen/scenes'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('[Firebase] Loaded scenes:', data);
      localStorage.setItem('karen-scenes', JSON.stringify(data));
      // Trigger re-render if needed
      window.dispatchEvent(new Event('scenes-updated'));
    }
  });
}

export async function saveToFirebase(scenes) {
  if (!db) throw new Error('Firebase not initialized');
  if (!window.currentUser) throw new Error('Not logged in');
  
  await set(ref(db, 'karen/scenes'), scenes);
  console.log('[Firebase] Saved scenes');
}
