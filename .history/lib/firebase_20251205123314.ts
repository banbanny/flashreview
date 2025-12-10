// lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config (corrected storageBucket)
const firebaseConfig = {
  apiKey: "AIzaSyDOUhYEstmROHMSr5qhKFx8pR0K5a0U8NM",
  authDomain: "flas-b3734.firebaseapp.com",
  projectId: "flas-b3734",
  storageBucket: "flas-b3734.appspot.com",   // ✅ FIXED
  messagingSenderId: "898599921698",
  appId: "1:898599921698:web:3cb1c78b93956e7fb9427b",
  measurementId: "G-S1BTB8C2VE"
};


// ✅ Initialize Firebase app safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ⚠️ Do NOT enable IndexedDB persistence in Expo by default
// It can break in mobile/web hybrid environments
// Uncomment this block ONLY if you are running in a browser
/*
import { enableIndexedDbPersistence } from "firebase/firestore";
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore persistence not enabled:", err.code);
  });
}
*/

export default app;
