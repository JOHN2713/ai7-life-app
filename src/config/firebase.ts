// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbHdt0oSNFWBk3IVGPbT0Bg0nWQE56rWE",
  authDomain: "misaludapp.firebaseapp.com",
  projectId: "misaludapp",
  storageBucket: "misaludapp.firebasestorage.app",
  messagingSenderId: "869359113604",
  appId: "1:869359113604:web:3a66503cc4e879ae1279d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const database = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);