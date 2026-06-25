// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC4sNDaLtqJQ8LVvAheIt3szcWVUI_B7_A",
  authDomain: "potochallenge-fb28f.firebaseapp.com",
  projectId: "potochallenge-fb28f",
  storageBucket: "potochallenge-fb28f.firebasestorage.app",
  messagingSenderId: "507651210080",
  appId: "1:507651210080:web:de8e154d0956a1a45cbc05"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
