import { Breadcrumbs } from "@/components/Breadcrumbs ";
import CategoriesItems from "@/components/CategoriesItems";
import React from "react";

const CategoriesPage = () => {
  return (
    <section className="container mx-auto px-4 py-10 flex flex-col gap-4 mt-36">
      <Breadcrumbs />
      <CategoriesItems />
    </section>
  );
};

export default CategoriesPage;
