import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbQl3L7zzW1O25mpNisDmIL4qbaIN01TQ",
  authDomain: "task-management-5a90a.firebaseapp.com",
  projectId: "task-management-5a90a",
  storageBucket: "task-management-5a90a.firebasestorage.app",
  messagingSenderId: "865643650429",
  appId: "1:865643650429:web:e81cee13f99473dc5e4014",
  measurementId: "G-S4C7C1KZMZ"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);