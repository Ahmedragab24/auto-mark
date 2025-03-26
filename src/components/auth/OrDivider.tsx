"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export function OrDivider() {
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedLanguage = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const storeLanguage = isClient ? selectedLanguage : "ar";

  useEffect(() => {
    setLanguage(storeLanguage);
  }, [storeLanguage]);

  const text = language === "ar" ? "او" : "OR";

  if (!isClient) return null;

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 text-gray-500 bg-background">{text}</span>
      </div>
    </div>
  );
}
