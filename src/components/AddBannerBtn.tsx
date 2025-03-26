"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import LoginModel from "./auth/LoginModel";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface IProps {
  className?: string;
  inOpenChange?: (open: boolean) => void;
}

const AddBannerBtn = ({ className, inOpenChange }: IProps) => {
  const { UserData, Language } = useAppSelector((state: RootState) => state);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [buttonSize, setButtonSize] = useState<"sm" | "lg">("lg");

  useEffect(() => {
    setIsClient(true);
    const user = UserData.token;
    setToken(user || null);

    const updateButtonSize = () => {
      setButtonSize(window.innerWidth < 768 ? "sm" : "lg");
    };

    updateButtonSize();
    window.addEventListener("resize", updateButtonSize);

    return () => window.removeEventListener("resize", updateButtonSize);
  }, [UserData.token]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {!token ? (
        <LoginModel>
          <Button size={buttonSize} className={className}>
            <h4>{Language.language === "ar" ? "اضف اعلان" : "Add Banner"}</h4>
            <Plus />
          </Button>
        </LoginModel>
      ) : (
        <Link
          href={"/advertisement/category"}
          onClick={() => inOpenChange?.(false)}
        >
          <Button size={buttonSize} className={className}>
            <h4>{Language.language === "ar" ? "اضف اعلان" : "Add Banner"}</h4>
            <Plus />
          </Button>
        </Link>
      )}
    </>
  );
};

export default AddBannerBtn;
