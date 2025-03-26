import React from "react";
import CategoriesItems from "../CategoriesItems";
import TitleSection from "../TitleSection";

const CategoriesSection = () => {
  return (
    <section className="section">
      <TitleSection title_en="Categories" title_ar="الأقسام" />
      <CategoriesItems />
    </section>
  );
};

export default CategoriesSection;
