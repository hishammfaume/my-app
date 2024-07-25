// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore , doc, setDoc} from "firebase/firestore";
import {getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is opti
const firebaseConfig = {
  apiKey: "AIzaSyCzE-eFPTppC4_rApA75otrh5NRG2mI4y0",
  authDomain: "expense-tracker-6648e.firebaseapp.com",
  projectId: "expense-tracker-6648e",
  storageBucket: "expense-tracker-6648e.appspot.com",
  messagingSenderId: "396053227829",
  appId: "1:396053227829:web:2fa150faebe3ef2116c47c",
  measurementId: "G-TYFVWGV51E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };