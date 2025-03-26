import React from "react";
import HeroFiltering from "../HeroFiltering";
import type { Metadata } from "next";
import HeroSectionText from "../HeroSectionText";
import HeroSectionImage from "../HeroSectionImage";

export const metadata: Metadata = {
  keywords: [
    "شراء سيارات",
    "بيع سيارات",
    "سيارات مستعملة",
    "موتسيكلات للبيع",
    "قوارب للبيع",
    "شاحنات للبيع",
    "قطع غيار سيارات",
    "خدمات السيارات",
    "معارض سيارات",
    "موقع سيارات في الوطن العربي",
    "أفضل أسعار السيارات",
    "تأجير سيارات",
    "شراء سيارات جديدة",
    "معارض سيارات مستعملة",
  ],
  robots: "index, follow",
  icons: "/Logo/Logo.png",
};

export function HeroSection() {
  return (
    <div className=" relative flex flex-col gap-8 px-8 md:pt-20 py-8 justify-between w-full overflow-hidden h-auto md:h-[540px] rounded-2xl mt-44">
      {/* Background Image */}
      <HeroSectionImage />

      {/* Hero Text */}
      <HeroSectionText />

      {/* Filter Bar */}
      <HeroFiltering />
    </div>
  );
}
