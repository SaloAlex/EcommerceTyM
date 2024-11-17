import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBClThDiqs2ntsWigUxVv_Ro-0YI0QY6M8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecommerce-mati.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecommerce-mati",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecommerce-mati.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "862242028887",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:862242028887:web:21d6a75559c9b90f6c9212",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-11GV0RYVWE",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
