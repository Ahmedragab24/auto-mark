"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";

const HeroSectionText = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  if (!isClient) return null;

  return (
    <div
      className={`relative z-10  text-white ${
        language === "ar" ? "text-right" : "text-left"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="max-w-2xl mb-4 text-2xl font-normal !leading-tight md:text-5xl">
        {language === "ar"
          ? "منصتك المجانيه لبيع وشراء السيارات بسهولة"
          : "Your free platform to buy and sell cars easily"}
      </h1>
      <p className="text-sm md:text-lg opacity-90">
        {language === "ar"
          ? "اكتشف سيارات مستعملة وموثوقة، قارن الأسعار،"
          : "Discover reliable used cars, compare prices,"}
        <br />
        {language === "ar"
          ? "وتواصل مباشرة مع البائعين بسهولة وأمان."
          : "Communicate directly with sellers easily and securely."}
      </p>
    </div>
  );
};

export default HeroSectionText;
