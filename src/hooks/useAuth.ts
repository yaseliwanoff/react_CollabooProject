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
  const registerWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const idToken = await getIdToken(user);
  
      const response = await axios.post(
        "https://collaboo.co/api-user/api/v1/user/",
        {
          user_id: user.uid,
          email: user.email,
          username: user.email?.split("@")[0] || "Anonymous",
          is_admin: false,
          image_url: "",
          trc20_address: "",
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        console.log("✅ User created on the server");
        await getUserToken();
        return true; // ✅ регистрация прошла успешно
      } else {
        console.error("❌ Error creating user on server:", response.data);
        setError("Failed to create user on server");
        return false; // ❌ сервер вернул ошибку
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else {
        setError(err.message || "An error occurred");
      }
      return false; // ❌ ошибка при регистрации
    }
  };

  // Регистрация через Google
  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      if (user) {
        const idToken = await getIdToken(user); // получаем Firebase ID токен
  
        const userData = {
          user_id: user.uid,
          username: user.displayName || "Anonymous",
          is_admin: false,
          image_url: user.photoURL || "",
          trc20_address: "",
        };
  
        const response = await axios.post(
          "https://collaboo.co/api-user/api/v1/user/",
          userData,
          {
            headers: {
              Authorization: `Bearer ${idToken}`, // Добавляем токен сюда
            },
          }
        );
  
        if (response.status === 200 || response.status === 201) {
          console.log("Google user created on the server");
        } else {
          console.error("Failed to create Google user on server:", response.data);
          setError("Server error during Google registration");
        }
  
        await getUserToken(); // обновим токен в состоянии
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };  

  // Логин с email и паролем
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Получаем Firebase токен и сохраняем
      const idToken = await getIdToken(user);
      localStorage.setItem("authToken", idToken);
      setToken(idToken); // если нужно
  
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      return false;
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
