"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

interface IProps {
  className?: string;
}

const LoaderSpan = ({ className }: IProps) => {
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className={`flex items-center justify-center h-screen gap-2 ${className}`}
    >
      <p>{language === "en" ? "...Loading" : "جاري التحميل..."}</p>
      <Loader className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};

export default LoaderSpan;
