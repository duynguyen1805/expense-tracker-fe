import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../configs/firebase.config";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await api.auth.signInWithGoogle({ idToken });

      const data = await response.data.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
    >
      <FcGoogle className="w-5 h-5" />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignIn;
