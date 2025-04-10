"use client";

import { useGetCategoriesQuery } from "@/store/apis/categories";
import { setCategories } from "@/store/features/categories";
import { setTypeAdvertisement } from "@/store/features/typeAdvertisement";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { MainCategoriesType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoriesItemsAds = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data } = useGetCategoriesQuery("categories");
  const categories = data?.data?.newCategories || [];
  const categoriesFiltered = categories.filter(
    (category: MainCategoriesType) => category.key !== "showroom"
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HandlerCategory = (category: any) => {
    dispatch(setCategories(category));
    if (category.key === "car") {
      dispatch(setTypeAdvertisement("car"));
    }
    if (category.key === "scrap") {
      dispatch(setTypeAdvertisement("scrap"));
    }
    if (category.key === "services") {
      dispatch(setTypeAdvertisement("service"));
    }
    if (category.key === "showroom") {
      dispatch(setTypeAdvertisement("showroom"));
    }
    if (category.key === "spare_parts") {
      dispatch(setTypeAdvertisement("spare_parts"));
    }
    if (category.key === "car_numbers") {
      dispatch(setTypeAdvertisement("carNumber"));
    }
  };

  return (
    <div className="mt-4">
      <h2
        className={`text-2xl  font-bold mb-4 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {language === "ar" ? "اختر تصنيف الاعلان" : "Choose Ad Category"}
      </h2>
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {categoriesFiltered.map((category: MainCategoriesType) => (
          <Link
            key={category.id}
            href={"/advertisement/" + category.key}
            onClick={() => HandlerCategory(category)}
          >
            <div className="w-full h-44 group relative bg-secondary rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-[4/3]">
              <div className="bg-gradient-to-t from-black/60 to-black/0" />
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`}
                alt={language === "ar" ? category.name_ar : category.name_en}
                width={700}
                height={700}
                quality={100}
                unoptimized
                className="absolute bottom-0 z-10 object-cover w-40 lg:w-52 h-auto transition-transform duration-300 left-4 group-hover:scale-105"
              />
              <div className="absolute top-0 right-0 z-20 p-6">
                <h3 className="text-xl font-semibold tracking-wide">
                  {language === "ar" ? category.name_ar : category.name_en}
                </h3>
              </div>
              <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesItemsAds;
