import { useState, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, signInWithPopup, googleProvider, signOut } from "@/lib/firebase"; // Импортируем signOut
import { signInWithEmailAndPassword, getIdToken, onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const newToken = await getIdToken(user, true); // Force a fresh token
          localStorage.setItem("authToken", newToken);
          setToken(newToken);
        } catch (err) {
          console.error("Error fetching token:", err);
          setError("Authentication error: ");
        }
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
      try {
        const newToken = await getIdToken(auth.currentUser, true); // Refresh token
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        return newToken;
      } catch (err) {
        console.error("Error fetching user token:", err);
        setError("Failed to retrieve token: ");
      }
    }
    return null;
  };

  const logout = async () => {
    try {
      await signOut(auth); // Выполняем выход из аккаунта
      localStorage.removeItem("authToken"); // Удаляем токен из локального хранилища
      setToken(null); // Обновляем состояние токена
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out: ");
    }
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

  return { registerWithEmail, registerWithGoogle, loginWithEmail, loginWithGoogle, getUserToken, token, isAuthReady, error, logout };
}