// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg5zgtZUYCPyi9x59DWhaLe5pbzCog2cE",
  authDomain: "maya-learn.firebaseapp.com",
  projectId: "maya-learn",
  storageBucket: "maya-learn.firebasestorage.app",
  messagingSenderId: "369181419439",
  appId: "1:369181419439:web:631e5565c3905351b4715a"
};

// Initialize Firebase

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;