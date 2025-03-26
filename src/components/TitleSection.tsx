"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";

interface IProps {
  className?: string;
  title_en: string;
  title_ar: string;
}

const TitleSection = ({ title_en, title_ar, className }: IProps) => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  if (!isClient) return null;

  return (
    <h2
      className={`section-title ${className} ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      {language === "en" ? title_en : title_ar}
    </h2>
  );
};

export default TitleSection;
