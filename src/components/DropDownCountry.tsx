"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, MapPin } from "lucide-react";
import { countryType } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { setCountry } from "@/store/features/country";
import { useCountriesData } from "@/hooks/use-countriesData";

interface IProps {
  className?: string;
}

const DropDownCountry = ({ className }: IProps) => {
  const { Countries } = useCountriesData();
  const { name_ar, name_en } = useAppSelector(
    (state: RootState) => state.Country.Country
  );
  const Language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const [SelectCountry, setSelectCountry] = useState<string>();
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [Language]);

  useEffect(() => {
    setSelectCountry(Language === "en" ? name_en : name_ar);
  }, [name_ar, name_en, Language]);

  if (!isClient) return null;

  return (
    <DropdownMenu dir={Language === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`text-white !text-bodyS lg:!text-sm ${className}`}
        >
          <MapPin />
          {SelectCountry}
          <ChevronDown className="w-4 h-4 mr-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full space-y-2">
        {Countries.map((item: countryType) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              dispatch(setCountry(item));
            }}
          >
            <div className="flex items-center gap-2">
              <Image
                src={item.image || "/default-image.png"}
                alt={item.name_en}
                width={100}
                height={100}
                className="w-4 h-4 rounded-sm"
                loading="lazy"
              />
              <h6>{Language === "en" ? item.name_en : item.name_ar}</h6>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownCountry;
