// Export Firestore DB

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8m9jy_vcMLjSa0WBefh4kuE4CepHRyZc",
  authDomain: "my-app-project-4fae1.firebaseapp.com",
  projectId: "my-app-project-4fae1",
  storageBucket: "my-app-project-4fae1.firebasestorage.app",
  messagingSenderId: "983016849872",
  appId: "1:983016849872:web:b8218572a4e92c6bd079d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);