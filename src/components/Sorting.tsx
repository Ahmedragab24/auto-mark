"use client";

import React from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSorting } from "@/store/features/sortingData";
import { setCurrentPage } from "@/store/features/currentPage";
import { sortOptions } from "@/constants";

type SortOptionValue = (typeof sortOptions.ar)[number]["value"];

interface SortSelectProps {
  className?: string;
}

const SortSelect: React.FC<SortSelectProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const currentSorting = useAppSelector((state) => state.Sorting.sort_by);
  const language = useAppSelector((state) => state.Language.language);

  const handleSortChange = (value: SortOptionValue) => {
    try {
      dispatch(setCurrentPage(1));
      dispatch(setSorting(value));
    } catch (error) {
      console.error("Error setting sorting:", error);
    }
  };

  const currentOptions = language === "en" ? sortOptions.en : sortOptions.ar;
  const placeholderText = language === "en" ? "Sort by" : "رتب حسب";
  const dir = language === "en" ? "ltr" : "rtl";

  return (
    <Select
      dir={dir}
      value={currentSorting || undefined}
      onValueChange={handleSortChange}
    >
      <SelectTrigger
        className={`w-fit flex items-center gap-2 ${className}`}
        aria-label="Sort options"
      >
        <Image
          src="/Icons/filterRed.png"
          alt="filter icon"
          width={20}
          height={20}
          className="w-4 h-4"
        />
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent>
        {currentOptions.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
