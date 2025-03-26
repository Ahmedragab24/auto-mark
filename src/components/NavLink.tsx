"use client";

import { navigationLink } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoginModel from "./auth/LoginModel";

interface IProps {
  className?: string;
  inOpenChange?: (open: boolean) => void;
}

const NavLink = ({ className, inOpenChange }: IProps) => {
  const pathname = usePathname();
  const { UserData, Language } = useAppSelector((state: RootState) => state);
  const Lang = Language.language;
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setToken(UserData.token || null);
  }, [UserData.token]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={className}>
      {navigationLink.map(({ title_ar, title_en, href }) =>
        href === "/advertisement" && !token ? (
          <LoginModel key={title_en} className="cursor-pointer">
            <span className="font-regular text-md text-gray-500 transition-colors hover:text-red-700">
              {Lang === "ar" ? title_ar : title_en}
            </span>
          </LoginModel>
        ) : (
          <Link
            key={title_en}
            href={href}
            className={`font-regular text-md text-gray-500 transition-colors hover:text-red-700 ${
              pathname === href ? "text-primary" : ""
            }`}
            onClick={() => inOpenChange?.(false)}
          >
            {Lang === "ar" ? title_ar : title_en}
          </Link>
        )
      )}
    </div>
  );
};

export default NavLink;
