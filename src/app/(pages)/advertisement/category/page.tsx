import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import CategoriesItemsAds from "@/components/advertisement/CategoriesItemsAds";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-4 mt-36">
      <Breadcrumbs />

      <CategoriesItemsAds />
    </div>
  );
};

export default page;
