import React from "react";
import { ModeToggle } from "./ModeToggle";
import DropDownCountry from "./DropDownCountry";
import DropDownLang from "./DropDownLang";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const TopBarMenuMobile = () => {
  return (
    <div className="md:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size={"icon"} className="group">
            <MenuIcon className="text-white group-hover:text-black dark:group-hover:text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="flex flex-col w-full gap-2">
          {/* Country Dropdown */}
          <DropDownCountry className="text-foreground" />

          {/* Language Dropdown */}
          <DropDownLang className="text-foreground" />

          {/* Theme Toggle */}
          <ModeToggle className="!text-foreground" />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopBarMenuMobile;
