import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ضع apiKey هنا",
  authDomain: "smartlab-store.firebaseapp.com",
  projectId: "smartlab-store",
  storageBucket: "smartlab-store.appspot.com",
  messagingSenderId: "1054079157533",
  appId: "1:1054079157533:web:xxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);