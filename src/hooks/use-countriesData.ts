"use client";

import { useGetCountriesQuery } from "@/store/apis/countries&cities";
import { useMemo } from "react";

export const useCountriesData = () => {
  const { data: CountryData } = useGetCountriesQuery("countries");

  const Countries = useMemo(
    () => CountryData?.data?.countries || [],
    [CountryData]
  );

  return { Countries };
};
