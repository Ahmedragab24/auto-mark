"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsBtn from "@/components/NotificationsBtn";
import LoginModel from "@/components/auth/LoginModel";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import MessagesBtn from "./MessagesBtn";

interface IProps {
  className?: string;
  inOpenChange?: (open: boolean) => void;
}

const NavbarActionBtn: React.FC<IProps> = ({ className, inOpenChange }) => {
  const { UserData } = useAppSelector((state: RootState) => state);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const user = UserData.token;
    setToken(user || null);
  }, [UserData.token]);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  const handleClick = () => inOpenChange?.(false);

  const renderButton = (href: string, icon: React.ReactNode) =>
    token ? (
      <Link href={href} onClick={handleClick}>
        <Button variant="secondary" size="icon" className={className}>
          {icon}
        </Button>
      </Link>
    ) : (
      <LoginModel>
        <Button variant="secondary" size="icon" className={className}>
          {icon}
        </Button>
      </LoginModel>
    );

  return (
    <div className="flex items-center gap-4">
      {renderButton("/favorites", <Heart />)}
      <NotificationsBtn
        className={className}
        onOpenChange={token ? inOpenChange || (() => {}) /* noop */ : undefined}
      />
      <MessagesBtn
        className={className}
        onOpenChange={token ? inOpenChange || (() => {}) /* noop */ : undefined}
      />
    </div>
  );
};

export default NavbarActionBtn;
