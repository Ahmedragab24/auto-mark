"use client";

import { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import DropDownCountry from "./DropDownCountry";
import DropDownLang from "./DropDownLang";
import TopBarMenuMobile from "./TopBarMenuMobile";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import LoginModel from "./auth/LoginModel";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";

const TopBar = () => {
  const { Language, UserData } = useAppSelector((state: RootState) => state);
  const Lang = Language.language;
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const user = UserData.token;
    setToken(user || null);
  }, [UserData.token, Lang]);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <div className="w-full bg-primary">
      <div className="container px-4 mx-auto">
        <nav
          className="flex items-center justify-between h-14"
          dir={Lang === "en" ? "ltr" : "rtl"}
        >
          {/* Account Section */}
          <div className="flex items-center gap-4">
            {token ? (
              <UserAvatar />
            ) : (
              <LoginModel>
                <Button variant={"ghost"} className="text-white">
                  {Lang === "en"
                    ? "Login / Register"
                    : "تسجيل الدخول / التسجيل"}
                </Button>
              </LoginModel>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-6 md:flex">
            {/* Country Dropdown */}
            <DropDownCountry />

            {/* Language Dropdown */}
            <DropDownLang />

            {/* Theme Toggle */}
            <ModeToggle />
          </div>

          {/* Mobile Menu Dropdown */}
          <TopBarMenuMobile />
        </nav>
      </div>
    </div>
  );
};

export default TopBar;
