import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import GoogleIcon from "../assets/images/svg/google.svg";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const isEmailValid = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!isEmailValid(value)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const isPasswordValid = password.length >= 8;
  const showMinLengthMessage = password.length > 0 && !isPasswordValid;

  return (
    <form className={cn("flex flex-col gap-6 font-[Inter]", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create new account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create a new account.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email..."
            required
            value={email}
            onChange={handleEmailChange}
            className={cn({ 'border-red-500': emailError })}
          />
          {emailError && (
            <span className="text-[14px] font-light opacity-60">
              {emailError}
            </span>
          )}
        </div>
        <div className="grid gap-3 font-[Inter]">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter password..."
            required
            value={password}
            onChange={handlePasswordChange}
            className={cn({ 'border-red-500': !isPasswordValid && password.length > 0 })}
          />
          {showMinLengthMessage && (
            <span className="text-[14px] font-light opacity-60">
              Minimum length – 8 symbols
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={!isEmailValid(email) || !isPasswordValid}>
          Sign up
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <img src={GoogleIcon} alt="google" />
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}
