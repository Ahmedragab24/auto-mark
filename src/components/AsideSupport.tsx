"use client";

import { SupportLink } from "@/constants";
import { useVersionInfoQuery } from "@/store/apis/autoMarkInfo";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Handshake, Headset, History, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const AsideSupport = () => {
  const pathname = usePathname();
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const { data: versionInfo } = useVersionInfoQuery("");
  const AutoMarkVersion = versionInfo?.APP_VERSION;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <aside className="flex flex-col gap-4 px-4 py-8 bg-background rounded-xl h-fit">
      <div className="flex flex-col gap-4">
        {SupportLink.map(({ name_ar, name_en, value, id, href }) => (
          <Link
            key={id}
            href={value === "version" ? "#" : href}
            className={`flex items-center gap-2 text-gray-600 hover:text-primary ${
              pathname === href ? "text-primary" : ""
            }`}
          >
            {value === "Questions" && <ShieldQuestion className="w-6 h-6" />}
            {value === "Terms" && <Handshake className="w-6 h-6" />}
            {value === "version" && <History className="w-6 h-6" />}
            {value === "contact" && <Headset className="w-6 h-6" />}

            <span>
              {language === "en" ? name_en : name_ar}{" "}
              {value === "version" ? AutoMarkVersion : ""}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default AsideSupport;
