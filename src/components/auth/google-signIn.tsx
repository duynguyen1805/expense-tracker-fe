import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../configs/firebase.config";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "@/hooks/use-toast";

const GoogleSignIn = () => {
  const router = useRouter();
  const { signInWithGoogle, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();

      await signInWithGoogle(idToken);

      toast({
        title: "Success",
        description: "Signed in successfully",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "Google sign-in failed",
        variant: "destructive",
      });
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
