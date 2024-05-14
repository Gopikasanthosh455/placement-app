// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdKFliXAwmgPaPHHi4GRuZmkvhn_cV9iQ",
  authDomain: "placement-app-fyp.firebaseapp.com",
  projectId: "placement-app-fyp",
  storageBucket: "placement-app-fyp.appspot.com",
  messagingSenderId: "1069341714628",
  appId: "1:1069341714628:web:d73ad8b39486e9e1760191",
  measurementId: "G-2LQJ0RJPSQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getFirestore(app);

export { app, auth, database }