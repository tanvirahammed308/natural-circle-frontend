import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "./firebase";

// =========================
// REGISTER
// =========================
export const registerUser = async (
  email: string,
  password: string
) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// =========================
// LOGIN
// =========================
export const loginUser = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  return await signOut(auth);
};

// =========================
// GET CURRENT USER TOKEN
// =========================
export const getCurrentToken = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  return await user.getIdToken(true);
};

// =========================
// AUTH STATE LISTENER
// (Redux sync helper)
// =========================
export const listenAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};