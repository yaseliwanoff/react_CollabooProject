// import { GalleryVerticalEnd } from "lucide-react"
import LoginBg from "../assets/images/jpg/login-bg.jpg";
import Logo from "../assets/images/svg/logo.svg";

import { LoginForm } from "@/components/login-form";
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-white flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to={"/"}>
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <img width={32} height={32} src={Logo} alt="logo" />
              </div>
              Collaboo
            </a>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={LoginBg}
          alt="login background image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}