import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALmQa8j_ZOTBhEOwSdyq7K3BHy5Q3T9WM",
  authDomain: "operation-cali.firebaseapp.com",
  projectId: "operation-cali",
  storageBucket: "operation-cali.firebasestorage.app",
  messagingSenderId: "434806854226",
  appId: "1:434806854226:web:9fb6380da82ee29946c58b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);