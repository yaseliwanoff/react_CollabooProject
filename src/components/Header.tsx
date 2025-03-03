// import { useState } from "react";
"use client"
 
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import Logo from "@/assets/images/svg/logo.svg";
import Lighting from "@/assets/images/svg/lightning.svg";
import AvatarImg from "@/assets/images/png/avatar.png";
import ChevronDown from "@/assets/images/svg/ChevronDown.svg";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export default function Header() {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <header className="bg-white py-3.5 border-b border-[#E4E4E7]">
      <div className="container flex items-center justify-between">
        <div>
          <Link to={"/"}>
            <a href="" className="flex items-center gap-2">
              <span>
                <img src={Logo} alt="logo" />
              </span>
              <span className="font-semibold">Collaboo</span>
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <nav className="text-[14px] font-medium flex items-center gap-6">
              <a className="opacity-50 hover:opacity-75 focus:opacity-100" href="#">Dashboard</a>
              <a className="opacity-50 hover:opacity-75 focus:opacity-100" href="#">Helpdesk</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">🇺🇸 ENG <span><img src={ChevronDown} alt="icon" /></span></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showStatusBar}
                  onCheckedChange={setShowStatusBar}
                >
                  🇺🇸 ENG
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showActivityBar}
                  onCheckedChange={setShowActivityBar}
                >
                  🇺🇸 ENG
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showPanel}
                  onCheckedChange={setShowPanel}
                >
                  ENG
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <span><img src={Lighting} alt="icon" /></span>
              Get Free Access
            </Button>
          </div>
          <div>
            <Avatar>
              <img width={36} height={36} src={AvatarImg} alt="avatar" />
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
