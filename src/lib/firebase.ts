import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// WebZinc Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsM2xSoxzYkMOyzXwS2T0gDyn3uXclBoA",
  authDomain: "web-zinc-bb7ec.firebaseapp.com",
  projectId: "web-zinc-bb7ec",
  storageBucket: "web-zinc-bb7ec.firebasestorage.app",
  messagingSenderId: "354394546216",
  appId: "1:354394546216:web:670dbefd2137914a23551d",
  measurementId: "G-Y5NBTZJYYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
