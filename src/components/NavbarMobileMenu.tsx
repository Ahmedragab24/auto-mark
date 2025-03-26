"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import NavLink from "./NavLink";
import NavbarActionBtn from "./NavbarActionBtn";
import AddBannerBtn from "./AddBannerBtn";
import { LayoutGrid } from "lucide-react";

const NavbarMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="القائمة"
        >
          <LayoutGrid />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] pt-10">
        <SheetHeader>
          <SheetTitle className="text-right">القائمة</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8 mt-6">
          {/* Search Bar */}
          <SearchBar inOpenChange={setIsMenuOpen} />

          {/* Navigation Links */}
          <NavLink
            className="flex flex-col gap-4"
            inOpenChange={setIsMenuOpen}
          />

          {/* Action Buttons */}
          <NavbarActionBtn inOpenChange={setIsMenuOpen} />

          {/* Add Banner */}
          <AddBannerBtn inOpenChange={setIsMenuOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMobileMenu;
