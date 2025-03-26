"use client";

import { useGetCitiesQuery } from "@/store/apis/countries&cities";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useMemo } from "react";

export const useCitiesData = () => {
  const Country = useAppSelector((state: RootState) => state.Country.Country);
  const { data: citiesData } = useGetCitiesQuery({
    countryID: Country.id,
  });

  const Cities = useMemo(() => citiesData?.data?.cities || [], [citiesData]);

  return { Cities };
};
