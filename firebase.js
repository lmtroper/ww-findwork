// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFPL0_qgYUXlq6OP7bE9cjrkmJF8AQy8s",
  authDomain: "ww-findwork.firebaseapp.com",
  projectId: "ww-findwork",
  storageBucket: "ww-findwork.appspot.com",
  messagingSenderId: "236917175285",
  appId: "1:236917175285:web:f4d267c0e3a06e3e68a6bc",
  measurementId: "G-HVLCRH50KT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
