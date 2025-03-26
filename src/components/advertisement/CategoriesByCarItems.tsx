import { useGetCategoriesByCarsQuery } from "@/store/apis/categories";
import { setCategories } from "@/store/features/categories";
import { setTypeAdvertisement } from "@/store/features/typeAdvertisement";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { CategoryCarsType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoriesByCarItems = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data } = useGetCategoriesByCarsQuery(language);
  const categories = data?.data?.categoriesWithSubcategories || [];
  const dispatch = useAppDispatch();

  console.log(categories);

  // Handler
  const HandlerCategory = (category: CategoryCarsType) => {
    dispatch(setCategories(category));
    if (category.name === "Cars" || category.name === "سيارات") {
      dispatch(setTypeAdvertisement("car"));
    }
    if (category.name === "motorcycles" || category.name === "دراجات") {
      dispatch(setTypeAdvertisement("motorcycle"));
    }
    if (category.name === "Trucks" || category.name === "شاحنات") {
      dispatch(setTypeAdvertisement("truck"));
    }
    if (category.name === "Boats" || category.name === "قوارب") {
      dispatch(setTypeAdvertisement("boat"));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category: CategoryCarsType) => (
        <Link
          key={category.id}
          href={"/advertisement/car/add-advertisement"}
          onClick={() => HandlerCategory(category)}
        >
          <div className="w-full h-44 group relative bg-secondary rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-[4/3]">
            <div className="bg-gradient-to-t from-black/60 to-black/0" />
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`}
              alt={category.name || "image"}
              width={700}
              height={500}
              className="absolute bottom-0 z-10 object-cover w-44 h-auto transition-transform duration-300 left-4 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 z-20 p-6">
              <h3 className="text-xl font-semibold tracking-wide">
                {category.name}
              </h3>
            </div>
            <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0  group-hover:opacity-100" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesByCarItems;
