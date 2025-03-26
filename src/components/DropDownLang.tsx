"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import { languages } from "@/constants";
import { langType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { setLanguage } from "@/store/features/language";

interface IProps {
  className?: string;
}

const DropDownLang = ({ className = "" }: IProps) => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [selectedLanguage, setSelectedLanguage] = useState("العربية");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  useEffect(() => {
    const currentLanguage = languages.find((lang) => lang.code === language);
    if (currentLanguage) setSelectedLanguage(currentLanguage.name);
  }, [language]);

  const handleLanguageChange = (code: langType) => {
    dispatch(setLanguage(code));
  };

  if (!isClient) return null;

  return (
    <DropdownMenu dir={language === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 text-white !text-bodyS lg:!text-sm ${className}`}
        >
          <Globe />
          {selectedLanguage}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        {languages.map(({ code, name, flag }) => (
          <DropdownMenuItem
            key={code}
            className="flex items-center justify-start gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100"
            onClick={() => handleLanguageChange(code as langType)}
          >
            <Image
              src={flag}
              alt={name}
              width={20}
              height={20}
              className="w-5 h-4"
            />
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownLang;
