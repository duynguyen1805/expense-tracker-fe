import { useEffect, useState } from "react";
import { auth } from "../configs/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { api } from "@/lib/api/client";

export const useAuthGoogle = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // get ID token and verify with backend
        const idToken = await firebaseUser.getIdToken();
        // call backend to get user data
        const response = await api.auth.signInWithGoogle({ idToken });
        if (!response.data.success) {
          throw new Error(response.data.message || "Login failed");
        }
        const userData = await response.data.data;
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
