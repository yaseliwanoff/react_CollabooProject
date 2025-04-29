import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
} from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

export function useAuth() {
  const [username, setUsername] = useState<string>("");
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.displayName || "User");
        const newToken = await getIdToken(user, true);
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
      } else {
        setUsername("");
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
        const newToken = await getIdToken(auth.currentUser, true);
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        return newToken;
      } catch (err) {
        console.error("Error fetching user token:", err);
        setError("Failed to retrieve token");
      }
    }
    return null;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setToken(null);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out");
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
        const newToken = await getUserToken(); // ждём Promise
        return Boolean(newToken);
      } else {
        console.error("❌ Error creating user on server:", response.data);
        setError("Failed to create user on server");
        return false;
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else {
        setError(err.message || "An error occurred");
      }
      return false;
    }
  };

  const registerWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const idToken = await getIdToken(user);

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
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          console.log("✅ Google user created on the server");
          const newToken = await getUserToken(); // ждём Promise
          return Boolean(newToken);
        } else {
          console.error("❌ Server error during Google registration:", response.data);
          setError("Server error during Google registration");
          return false;
        }
      }

      return false;
    } catch (err) {
      console.error("❌ registerWithGoogle error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await getIdToken(user);
      localStorage.setItem("authToken", idToken);
      setToken(idToken);

      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider);
      const newToken = await getUserToken(); // ждём Promise
      return Boolean(newToken);
    } catch (err) {
      console.error("Login with Google error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  return {
    username,
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
