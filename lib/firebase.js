import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa2AAURvl-lk--YHHeuxoGIQj2IJMiY1g",
  authDomain: "smartlab-store.firebaseapp.com",
  projectId: "smartlab-store",
  storageBucket: "smartlab-store.firebasestorage.app",
  messagingSenderId: "1054079157533",
  appId: "1:1054079157533:web:8f2124367272bb78444df4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);