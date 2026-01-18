// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7L3fRbbBpeOzVXYb7mweUV2jZUxNk3to",
    authDomain: "shelf-93f4c.firebaseapp.com",
    projectId: "shelf-93f4c",
    storageBucket: "shelf-93f4c.firebasestorage.app",
    messagingSenderId: "137640256196",
    appId: "1:137640256196:web:96654db9080ee6e5b75f91",
    measurementId: "G-GF4CN2MYG5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Initialize Firebase
export const auth = getAuth(app);

