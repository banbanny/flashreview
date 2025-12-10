// lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config (corrected storageBucket)
const firebaseConfig = {
  apiKey: "AIzaSyDOUhYEstmROHMSr5qhKFx8pR0K5a0U8NM",
  authDomain: "flas-b3734.firebaseapp.com",
  projectId: "flas-b3734",
  storageBucket: "flas-b3734.firebasestorage.app",
  messagingSenderId: "898599921698",
  appId: "1:898599921698:web:3cb1c78b93956e7fb9427b",
  measurementId: "G-S1BTB8C2VE"
};


// ✅ Initialize Firebase app safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);



export default app;
