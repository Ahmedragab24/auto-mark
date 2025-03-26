import { Breadcrumbs } from "@/components/Breadcrumbs ";
import FilterSidebar from "@/components/FilterSidbar";
import ProductsFiltering from "@/components/ProductsFiltering";
import React from "react";

const page = () => {
  return (
    <section className="container px-4 mt-40">
      <Breadcrumbs />
      <div className="flex flex-col items-start gap-1 md:gap-10 mx-auto md:flex-row md:mt-8">
        <FilterSidebar typeCategory="scrap" />
        <ProductsFiltering typeCategory="scrap" />
      </div>
    </section>
  );
};

export default page;
