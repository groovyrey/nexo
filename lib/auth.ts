import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return null;
  }
};

export const signOutWithGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out with Google:", error);
  }
};
