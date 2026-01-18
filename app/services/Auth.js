import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";


export async function signup(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
}

export async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}