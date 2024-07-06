// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
