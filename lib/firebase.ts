// Export Firestore DB


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8m9jy_vcMLjSa0WBefh4kuE4CepHRyZc",
  authDomain: "my-app-project-4fae1.firebaseapp.com",
  projectId: "my-app-project-4fae1",
  storageBucket: "my-app-project-4fae1.firebasestorage.app",
  messagingSenderId: "983016849872",
  appId: "1:983016849872:web:b8218572a4e92c6bd079d5"
};





// ✅ Initialize Firebase once
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// ✅ This MUST be a Firestore instance
export const db: Firestore = getFirestore(app);
