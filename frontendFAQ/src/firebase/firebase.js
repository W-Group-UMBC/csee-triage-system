import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFJkcOMWmgbs0b-bVTvHWSLIdrIc4AubQ",
  authDomain: "wgroupcseetriagesystem.firebaseapp.com",
  projectId: "wgroupcseetriagesystem",
  storageBucket: "wgroupcseetriagesystem.firebasestorage.app",
  messagingSenderId: "61043486188",
  appId: "1:61043486188:web:265170e59a1a8742bda4c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services you will use
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
