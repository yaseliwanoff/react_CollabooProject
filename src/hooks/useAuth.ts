import { useState, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, signInWithPopup, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, getIdToken, onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Следим за изменением состояния пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newToken = await getIdToken(user, true); // Принудительное обновление токена
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
      } else {
        localStorage.removeItem("authToken");
        setToken(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const getUserToken = async () => {
    if (auth.currentUser) {
      const newToken = await getIdToken(auth.currentUser, true); // Принудительно обновляем access_token
      localStorage.setItem("authToken", newToken);
      setToken(newToken);
      return newToken;
    }
    return null;
  };

  const registerWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await getUserToken();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const registerWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await getUserToken();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await getUserToken();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await getUserToken();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return { registerWithEmail, registerWithGoogle, loginWithEmail, loginWithGoogle, getUserToken, token, isAuthReady, error };
}
