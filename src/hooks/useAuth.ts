import { useState, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, signInWithPopup, googleProvider, signOut } from "@/lib/firebase"; // Импортируем signOut
import { signInWithEmailAndPassword, getIdToken, onAuthStateChanged } from "firebase/auth";
import axios from "axios"; // Импортируем axios для отправки запросов на сервер

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения актуального токена
  const getUserToken = async () => {
    if (auth.currentUser) {
      try {
        const newToken = await getIdToken(auth.currentUser, true); // Принудительное обновление токена
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

  // Следим за состоянием аутентификации пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const newToken = await getIdToken(user, true); // Принудительное обновление токена
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

  const logout = async () => {
    try {
      await signOut(auth); // Выход из аккаунта
      localStorage.removeItem("authToken"); // Удаляем токен из локального хранилища
      setToken(null); // Обновляем состояние токена
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out: ");
    }
  };

  // Регистрация с email и паролем
  const registerWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Получаем пользователя
      console.log("User ID:", user.uid); // Выводим в консоль ID пользователя

      // Отправляем данные пользователя на сервер для создания записи в базе данных
      const response = await axios.post("https://your-api-endpoint.com/create-user", {
        uid: user.uid,
        email: user.email,
      });

      if (response.status === 200) {
        console.log("User created on the server");
      } else {
        console.error("Error creating user on server:", response.data);
        setError("Failed to create user on server");
      }

      await getUserToken(); // Получаем и обновляем токен после регистрации
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Регистрация через Google
  const registerWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await getUserToken(); // Получаем и обновляем токен после авторизации через Google
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Логин с email и паролем
  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await getUserToken(); // Получаем и обновляем токен после входа
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Логин через Google
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await getUserToken(); // Получаем и обновляем токен после авторизации через Google
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    registerWithEmail,
    registerWithGoogle,
    loginWithEmail,
    loginWithGoogle,
    getUserToken,
    token,
    isAuthReady,
    error,
    logout,
  };
}
