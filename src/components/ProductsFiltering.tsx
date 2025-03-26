"use client";

import React from "react";
import FilterButtons from "./FilterButtons";
import FilterProducts from "./FilterProducts";
import { CategoriesKeyType } from "@/types";

interface IProps {
  typeCategory: CategoriesKeyType;
}

const ProductsFiltering = ({ typeCategory }: IProps) => {
  return (
    <div className="flex flex-col w-full gap-6 lg:gap-0 py-2">
      {typeCategory === "car" && <FilterButtons />}

      <FilterProducts typeCategory={typeCategory} />
    </div>
  );
};

export default ProductsFiltering;
