import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import GoogleIcon from "../assets/images/svg/google.svg";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { loginWithEmail, loginWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isEmailValid = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isEmailValid(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      console.log("Login successful");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6 font-[Inter]", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={handleEmailChange}
            className={cn({ 'border-red-500': isSubmitted && emailError })}
          />
          {isSubmitted && emailError && (
            <span className="text-[14px] font-light opacity-60">{emailError}</span>
          )}
        </div>
        <div className="grid gap-3 font-[Inter]">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={handlePasswordChange}
            className={cn({ 'border-red-500': isSubmitted && passwordError })}
          />
          {isSubmitted && passwordError && (
            <span className="text-[14px] font-light opacity-60">{passwordError}</span>
          )}
        </div>
        <Button type="submit" className="w-full">Login</Button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
        </div>
        <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
          <img src={GoogleIcon} alt="google" />
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">Sign up</Link>
      </div>
    </form>
  );
}
