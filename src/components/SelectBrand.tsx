import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { brand } from "@/constants";

interface IProps {
  className?: string;
}

const SelectBrand = ({ className }: IProps) => {
  return (
    <Select dir="rtl">
      <SelectTrigger className={`w-fit flex items-center gap-2 ${className}`}>
        <Image
          src={"/Icons/filterRed.png"}
          alt="filter"
          width={20}
          height={20}
          className="w-4 h-4"
        />
        <SelectValue placeholder="رتب حسب الشهرة" />
      </SelectTrigger>
      <SelectContent>
        {brand.map(({ name, value }) => (
          <SelectItem key={value} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectBrand;
