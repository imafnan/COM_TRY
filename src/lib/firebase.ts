import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // ✅ RTDB

const firebaseConfig = {
  apiKey: "AIzaSyDi_-rlUEnAwySqs3fPDYOgSipcYa_b8yA",
  authDomain: "uxtodov2.firebaseapp.com",
  databaseURL: "https://uxtodov2-default-rtdb.firebaseio.com", // ✅ required
  projectId: "uxtodov2",
  storageBucket: "uxtodov2.firebasestorage.app",
  messagingSenderId: "193634946172",
  appId: "1:193634946172:web:c99c8517e647129dbbcdf9",
  measurementId: "G-D1XVBDZVVL"
};

// Prevent re-initialization (Next.js safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔥 Firebase services
export const db = getFirestore(app);       // Firestore (optional)
export const rtdb = getDatabase(app);      // ✅ Realtime Database
export const auth = getAuth(app);          // Authentication
export const storage = getStorage(app);    // Storage
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
