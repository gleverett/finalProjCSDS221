// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDryTDQSe-d1idM_sTstu94QGW2l-ptuTg",
  authDomain: "fullstackfinalproj.firebaseapp.com",
  projectId: "fullstackfinalproj",
  storageBucket: "fullstackfinalproj.appspot.com",
  messagingSenderId: "40407157463",
  appId: "1:40407157463:web:a50a1e5f2e4c9906fd7e92",
  measurementId: "G-QSJJCJ2DTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
