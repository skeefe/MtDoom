import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCJKMQ6LgPSQhphBhMbDzDpfC8T7wsLUCQ",
  authDomain: "mt-doom-40k.firebaseapp.com",
  projectId: "mt-doom-40k",
  storageBucket: "mt-doom-40k.appspot.com",
  messagingSenderId: "685003268245",
  appId: "1:685003268245:web:ea58fce7f6bb5b8b5abb9c",
  measurementId: "G-DJ2JKM3WR6"
};

const firebase_app = initializeApp(firebaseConfig);

export default firebase_app;