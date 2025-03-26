"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const HeroSectionImage = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  if (!isClient) return null;

  return (
    <Image
      src="/Images/hero-bg.jpg"
      alt="Jeep in desert"
      fill
      className={`object-cover transition-transform ${
        language === "en" ? "scale-x-[-1]" : ""
      }`}
      priority
    />
  );
};

export default HeroSectionImage;
