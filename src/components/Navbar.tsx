import React, { useEffect, useState } from "react";
import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarActionBtn from "./NavbarActionBtn";
import SearchBar from "./SearchBar";
import NavLink from "./NavLink";
import Logo from "./Logo";
import AddBannerBtn from "./AddBannerBtn";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export function Navbar() {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  if (!isClient) return null;
  return (
    <header className="w-full border-b">
      <div className="container px-4 py-2 mx-auto">
        <nav
          className="flex items-center justify-between h-16 gap-4"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <NavLink className="hidden gap-6 md:flex" />

          {/* Search Bar */}
          <SearchBar className="w-[40%] hidden md:flex" />

          {/* Action Buttons */}
          <NavbarActionBtn className="hidden md:flex" />

          {/* Add Banner */}
          <AddBannerBtn className="hidden md:flex" />

          {/* Mobile Menu */}
          <NavbarMobileMenu />
        </nav>
      </div>
    </header>
  );
}
