import { useState } from "react";
import { auth, createUserWithEmailAndPassword, signInWithPopup, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getIdToken } from "firebase/auth"; 

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const getUserToken = async () => {
    const user = auth.currentUser;
    if (user) {
      return await getIdToken(user);
    }
    return null;
  };

  // Регистрация с email и password
  const registerWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Регистрация через Google
  const registerWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Авторизация через email, password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Авторизация через Google
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return { registerWithEmail, registerWithGoogle, loginWithEmail, loginWithGoogle, getUserToken, error };
}
