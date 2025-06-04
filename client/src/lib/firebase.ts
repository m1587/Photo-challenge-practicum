// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

  const firebaseConfig = {
  apiKey: "AIzaSyCVE2xdvFCg8OWoNYDT5F82M38_KPUpVzY",
  authDomain: "photochallenge-f053c.firebaseapp.com",
  projectId: "photochallenge-f053c",
  storageBucket: "photochallenge-f053c.firebasestorage.app",
  messagingSenderId: "297899099437",
  appId: "1:297899099437:web:7b709b57a679a02446bfa4"
};


const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
