// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAfvpa_fitLkru9bqarfdPpCdBPs6ZLvU",
  authDomain: "nabungah-ac5f5.firebaseapp.com",
  projectId: "nabungah-ac5f5",
  storageBucket: "nabungah-ac5f5.firebasestorage.app",
  messagingSenderId: "210402543709",
  appId: "1:210402543709:web:a8305c61d7eec4f12ce5b4",
  measurementId: "G-XKGMG7WB58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };