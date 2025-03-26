// hooks/useAuth.ts
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
