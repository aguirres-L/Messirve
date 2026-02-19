// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// En producción conviene usar variables de entorno (Vite: import.meta.env.VITE_*)
const firebaseConfig = {
  apiKey: "AIzaSyDOzQ6juhGcJMDIx4CxvxGd5joGXnqHyQY",
  authDomain: "the-last-suite.firebaseapp.com",
  projectId: "the-last-suite",
  storageBucket: "the-last-suite.firebasestorage.app",
  messagingSenderId: "274795975057",
  appId: "1:274795975057:web:37124d8ac8b6f1689a0a30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Servicios exportados para usar en la app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
