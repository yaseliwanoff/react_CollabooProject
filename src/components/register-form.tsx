import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import GoogleIcon from "../assets/images/svg/google.svg";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { registerWithEmail, registerWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isEmailValid = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!isEmailValid(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    if (!isPasswordValid) {
      setPasswordError("Minimum length – 8 symbols");
      return;
    }

    const success = await registerWithEmail(email, password);

    if (success) {
      navigate("/login");
    }
  };

  const handleGoogleRegister = async () => {
    const success = await registerWithGoogle();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6 font-[Inter]", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create new account</h1>
        <p className="text-muted-foreground text-sm">Enter your email below to create a new account.</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn({ "border-red-500": emailError })}
          />
          {emailError && <span className="text-[14px] text-red-500">{emailError}</span>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn({ "border-red-500": passwordError })}
          />
          {passwordError && <span className="text-[14px] text-red-500">{passwordError}</span>}
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <Button type="submit" className="w-full">Sign up</Button>
        <div className="relative text-center text-sm">
          <span className="bg-background text-muted-foreground px-2">Or continue with</span>
        </div>
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleRegister}>
          <img src={GoogleIcon} alt="google" />
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account? <Link to="/login" className="underline">Sign in</Link>
      </div>
    </form>
  );
}
