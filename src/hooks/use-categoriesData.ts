"use client";

import { useGetCategoriesByCarsQuery } from "@/store/apis/categories";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useMemo } from "react";

export const useCategoriesData = () => {
  const { Language } = useAppSelector((state: RootState) => state);
  const { data: CategoriesData } = useGetCategoriesByCarsQuery(
    Language.language
  );

  const Category = useMemo(
    () => CategoriesData?.data?.categoriesWithSubcategories || [],
    [CategoriesData]
  );

  return { Category };
};
