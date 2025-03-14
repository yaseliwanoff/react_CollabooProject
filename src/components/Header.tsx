import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Logo from "@/assets/images/svg/logo.svg";
import Lighting from "@/assets/images/svg/lightning.svg";
import AvatarImg from "@/assets/images/png/avatar.png";
import Subscribe from "@/assets/images/svg/Subscribe.svg";
import Settings from "@/assets/images/svg/Settings.svg";
import LogOut from "@/assets/images/svg/LogOut.svg";
import Payments from "@/assets/images/svg/Payments.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="fixed w-full bg-white py-3.5 border-b border-[#E4E4E7] z-50">
      <div className="container1 flex items-center justify-between">
        <div>
            <a href="" className="flex items-center gap-2">
              <span>
                <img src={Logo} alt="logo" />
              </span>
              <span className="font-semibold">Collaboo</span>
            </a>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <nav className="text-[14px] font-medium flex items-center gap-6">
              <a className="header-nav-menu" href="/">Dashboard</a>
              <a className="header-nav-menu" href="/help">Helpdesk</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  <SelectItem value="apple">🇺🇸 ENG</SelectItem>
                  <SelectItem value="banana">🇷🇺 RUS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              <span><img src={Lighting} alt="icon" /></span>
              Get Free Access
            </Button>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <img width={36} height={36} src={AvatarImg} alt="avatar" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="flex items-center p-2">
                  <Avatar className="mr-2">
                    <img width={36} height={36} src={AvatarImg} alt="avatar" />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[14px]">user123451</span>
                    <span className="text-gray-500 text-[12px]">m@example.com</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <img src={Subscribe} alt="Subscribe" />
                    <Link to={"/"}><span>Get subscription</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <img src={Settings} alt="Settings" />
                    <Link to={"/profile"}><span>Settings</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <img src={Payments} alt="Payments" />
                    <Link to={"/"}><span>Payments</span></Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <img src={LogOut} alt="Log out" />
                  <Link to={"#"}><span>Log out</span></Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
