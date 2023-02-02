
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbNfDWHji-4tB7ySDs5LJcwY7hcfYw15Y",
  authDomain: "gta-housing-marketplace.firebaseapp.com",
  projectId: "gta-housing-marketplace",
  storageBucket: "gta-housing-marketplace.appspot.com",
  messagingSenderId: "805327375638",
  appId: "1:805327375638:web:8e2fd694186bc878639437"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
