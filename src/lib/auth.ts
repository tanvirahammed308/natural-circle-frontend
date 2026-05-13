// Only Firebase Authentication layer

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

import { auth } from "./firebase";

// =========================
// GOOGLE PROVIDER
// =========================
const googleProvider = new GoogleAuthProvider();

// =========================
// REGISTER (EMAIL + NAME)
// =========================
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userCred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  //  set display name
  await updateProfile(userCred.user, {
    displayName: name,
  });

  return userCred;
};

// =========================
// LOGIN (EMAIL)
// =========================
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// =========================
// GOOGLE LOGIN
// =========================
export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  return result.user;
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  return await signOut(auth);
};

// =========================
// GET CURRENT TOKEN
// =========================
export const getCurrentToken = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  return await user.getIdToken(true);
};

// =========================
// AUTH LISTENER (Redux sync)
// =========================
export const listenAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};