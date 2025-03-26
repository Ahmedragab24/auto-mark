"use client";

import * as React from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface IProps {
  className?: string;
}

// ترجمة النصوص بناءً على اللغة المختارة
const translations: Record<
  string,
  { system: string; light: string; dark: string }
> = {
  ar: { system: "النظام", light: "الفاتح", dark: "الداكن" },
  en: { system: "System", light: "Light", dark: "Dark" },
};

export function ModeToggle({ className }: IProps) {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { theme, setTheme } = useTheme();
  const [themeName, setThemeName] = React.useState(
    translations[language]?.system || "النظام"
  );
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, [language]);

  React.useEffect(() => {
    setThemeName(
      theme === "dark"
        ? translations[language]?.dark
        : theme === "light"
        ? translations[language]?.light
        : translations[language]?.system
    );
  }, [theme, language]);

  if (!isClient) return null;

  return (
    <DropdownMenu dir={language === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex flex-nowrap items-center gap-3 px-2 py-1 text-white text-xs lg:text-sm sm:px-4 sm:py-2 ${className}`}
        >
          <div className="relative flex items-center w-4 h-4">
            <Sun className="absolute w-auto h-auto transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-auto h-auto transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
          </div>

          <span className="min-w-max">{themeName}</span>

          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {translations[language]?.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {translations[language]?.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {translations[language]?.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
