// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD7L3fRbbBpeOzVXYb7mweUV2jZUxNk3to",
  authDomain: "shelf-93f4c.firebaseapp.com",
  projectId: "shelf-93f4c",
  storageBucket: "shelf-93f4c.firebasestorage.app",
  messagingSenderId: "137640256196",
  appId: "1:137640256196:web:96654db9080ee6e5b75f91",
  measurementId: "G-GF4CN2MYG5",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Initialize Firebase
export const auth = getAuth(app);
