import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import axios from "axios";

export function ForgotForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://collaboo.co/api-user/api/v1/user/refresh-password",
        { email }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      } else {
        setEmailError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Failed to send reset email.";
        setEmailError(message);
      } else {
        setEmailError("Unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6 font-[Inter]", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>
        <p className="text-muted-foreground text-sm">Enter email to reset password.</p>
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
            disabled={isSubmitting}
          />
          {emailError && <span className="text-[14px] text-red-500">{emailError}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Reset Password"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account? <Link to="/login" className="underline">Sign in</Link>
      </div>
    </form>
  );
}
