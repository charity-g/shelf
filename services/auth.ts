import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";

export async function signup(
  email: string,
  password: string,
  username: string,
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  return user;
}

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

function saveUserToLocalStorage(user: any) {
  // Implement local storage saving logic here
}

function getUserFromLocalStorage() {
  // Implement local storage retrieval logic here
}

function clearUserFromLocalStorage() {
  // Implement local storage clearing logic here
}
