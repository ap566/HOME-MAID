import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC10-SVYV9m4jBAOWUhSylgu_qeZfPh_Eo",
  authDomain: "home-maid-9b643.firebaseapp.com",
  projectId: "home-maid-9b643",
  storageBucket: "home-maid-9b643.firebasestorage.app",
  messagingSenderId: "590119247146",
  appId: "1:590119247146:web:c41e8e6b9f5ba28327d253"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
