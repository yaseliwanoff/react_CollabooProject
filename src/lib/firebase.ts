import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"; // Импортируем signOut

const firebaseConfig = {
  apiKey: "AIzaSyAxfFm_vWEz4_h3xOD9DApqRTdTjbq2crY",
  authDomain: "local-soulwi.firebaseapp.com",
  projectId: "local-soulwi",
  storageBucket: "local-soulwi.appspot.com",
  messagingSenderId: "944388395479",
  appId: "1:944388395479:web:b160914f7f0a09a2083b92",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, createUserWithEmailAndPassword, signInWithPopup, googleProvider, signOut };
