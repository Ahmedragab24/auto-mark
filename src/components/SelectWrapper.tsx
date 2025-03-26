"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

interface SelectWrapperProps extends Omit<SelectProps, "value"> {
  placeholder: string;
  options: {
    id?: number;
    name?: string;
    name_en?: string;
    name_ar?: string;
    value?: string;
  }[];
  value?: string;
}

const SelectWrapper: React.FC<SelectWrapperProps> = React.memo(
  ({ placeholder, options, value, ...props }) => {
    const { language } = useAppSelector((state: RootState) => state.Language);

    return (
      <Select {...props} value={value}>
        <SelectTrigger className="h-12 !bg-background/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const { id, name, name_en, name_ar, value: optionValue } = option;
            const displayValue = optionValue || name || name_en || `${id}`;
            const displayName = name
              ? name
              : language === "en"
              ? name_en
              : name_ar;

            return (
              <SelectItem
                key={id || optionValue || displayName}
                value={displayValue}
              >
                {displayName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }
);

SelectWrapper.displayName = "SelectWrapper";

export default SelectWrapper;
