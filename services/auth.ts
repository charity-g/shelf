import AsyncStorage from "@react-native-async-storage/async-storage";
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
  await saveUserToAsyncStorage(user);
  return user;
}

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await saveUserToAsyncStorage(userCredential.user);
  return userCredential.user;
}

async function saveUserToAsyncStorage(user: any) {
  await AsyncStorage.setItem("auth", JSON.stringify(user));
}

export async function getUidFromAsyncStorage(): Promise<string | null> {
  return AsyncStorage.getItem("auth").then((data) =>
    data ? JSON.parse(data).uid : null,
  );
}

export async function getUserFromAsyncStorage(): Promise<any | null> {
  return AsyncStorage.getItem("auth").then((data) =>
    data ? JSON.parse(data) : null,
  );
}

async function _clearUserFromAsyncStorage() {
  await AsyncStorage.removeItem("auth");
}
