// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3oG-ZGcgY_oTdr6eRNrb38A7U8HHpwaY",
  authDomain: "oneagain-96d00.firebaseapp.com",
  projectId: "oneagain-96d00",
  storageBucket: "oneagain-96d00.appspot.com",
  messagingSenderId: "376599460882",
  appId: "1:376599460882:web:e5834a6c0a4f98b9dfeccb",
  measurementId: "G-VQPSGWHGZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getFirestore(app);

export {
 storage
}