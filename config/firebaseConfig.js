// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- ADICIONADO
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1crG8V2v3W60Iqf9q4z53XKaoYi4tpE0",
  authDomain: "tempos-9f627.firebaseapp.com",
  databaseURL: "https://tempos-9f627-default-rtdb.firebaseio.com",
  projectId: "tempos-9f627",
  storageBucket: "tempos-9f627.firebasestorage.app",
  messagingSenderId: "516386577723",
  appId: "1:516386577723:web:768fa36590f42ea5332b1e",
  measurementId: "G-JVDKX04M83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on web platform (not available on React Native)
if (Platform.OS === "web") {
  try {
    const { getAnalytics } = require("firebase/analytics");
    getAnalytics(app);
  } catch (error) {
    // Analytics não disponível, ignorar
  }
}

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app); // <-- EXPORTA O DB

export default app;
