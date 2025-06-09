"use client";

import { useGetCategoriesQuery } from "@/store/apis/categories";
import {
  clearAllProductsType,
  setAllProductsType,
} from "@/store/features/AllProductsType";
import { clearAge } from "@/store/features/attributes/age";
import { clearAutoParts } from "@/store/features/attributes/autoParts";
import { clearAutoPartsCategories } from "@/store/features/attributes/autoPartsCategories";
import { clearBodyType } from "@/store/features/attributes/bodyType";
import { clearBrand } from "@/store/features/attributes/brand";
import { clearBrandName } from "@/store/features/attributes/brandName";
import {
  clearColorExterior,
  clearColorInterior,
} from "@/store/features/attributes/colors";
import { clearCondition } from "@/store/features/attributes/condition";
import { clearEngineCount } from "@/store/features/attributes/engineCount";
import { clearFuel } from "@/store/features/attributes/fuelType";
import { clearHeight } from "@/store/features/attributes/height";
import { clearHorsePower } from "@/store/features/attributes/horsepower";
import { clearMileage } from "@/store/features/attributes/mileage";
import { clearModel } from "@/store/features/attributes/model";
import { clearModelName } from "@/store/features/attributes/modelName";
import { clearMotoEngine } from "@/store/features/attributes/motoEngine";
import { clearNumOfCylinders } from "@/store/features/attributes/numOfCylinders";
import { clearNumOfSeats } from "@/store/features/attributes/numOfSeats";
import { clearNumOfTries } from "@/store/features/attributes/numOfTries";
import { clearPowerTransSys } from "@/store/features/attributes/powerTransmissionSystem";
import { clearServicesSections } from "@/store/features/attributes/servicesSections";
import { clearSpecific } from "@/store/features/attributes/specifications";
import { clearSubSections } from "@/store/features/attributes/subSections";
import { clearWeight } from "@/store/features/attributes/weight";
import { clearYear } from "@/store/features/attributes/year";
import { setCategories } from "@/store/features/categories";
import { clearCity } from "@/store/features/city";
import { setCountry } from "@/store/features/country";
import { clearFilters } from "@/store/features/filter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { CategoryCarsType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoriesItems = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data } = useGetCategoriesQuery("categories");
  const categories = data?.data?.newCategories || [];
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  console.log(categories);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerCategory = (category: any) => {
    dispatch(setCategories(category));
    dispatch(setAllProductsType("category"));
    dispatch(
      setCountry({
        id: 1,
        name_ar: "الإمارات العربية المتحدة",
        name_en: "United Arab Emirates",
      })
    );
    dispatch(clearCity());
    dispatch(clearAge());
    dispatch(clearAutoParts());
    dispatch(clearBodyType());
    dispatch(clearBrand());
    dispatch(clearColorExterior());
    dispatch(clearColorInterior());
    dispatch(clearCondition());
    dispatch(clearEngineCount());
    dispatch(clearFilters());
    dispatch(clearFuel());
    dispatch(clearHeight());
    dispatch(clearHorsePower());
    dispatch(clearMileage());
    dispatch(clearModel());
    dispatch(clearMotoEngine());
    dispatch(clearNumOfCylinders());
    dispatch(clearNumOfSeats());
    dispatch(clearNumOfTries());
    dispatch(clearPowerTransSys());
    dispatch(clearSpecific());
    dispatch(clearSubSections());
    dispatch(clearWeight());
    dispatch(clearYear());
    dispatch(clearAllProductsType());
    dispatch(clearAutoPartsCategories());
    dispatch(clearBrandName());
    dispatch(clearModelName());
    dispatch(clearServicesSections());
  };

  const getCategoryImage = (key: string): string => {
    const images: Record<string, string> = {
      car: "/Images/car.png",
      scrap: "/Images/scrap.png",
      services: "/Images/services.png",
      showroom: "/Images/showroom.png",
      spare_parts: "/Images/spare_parts.png",
      car_numbers: "/Images/car_numbers.png",
    };

    return images[key] || "/Images/default.jpg";
  };

  if (!isClient) return null;

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pb-10"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {categories.map((category: CategoryCarsType) => (
        <Link
          key={category.id}
          href={"/categories/" + category.key}
          onClick={() => handlerCategory(category)}
        >
          <div className="w-full h-44 group relative bg-secondary rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 aspect-[4/3]">
            <div className="bg-gradient-to-t from-black/60 to-black/0" />
            <Image
              src={getCategoryImage(category.key)}
              alt={
                language === "ar"
                  ? category?.name_ar ?? ""
                  : category?.name_en ?? ""
              }
              width={200}
              height={100}
              quality={100}
              unoptimized
              className="absolute bottom-0 z-10 object-cover transition-transform duration-300 left-4 group-hover:scale-105"
            />

            <div className="absolute top-0 right-0 z-20 p-8">
              <h3 className="text-2xl font-bold tracking-wide">
                {language === "ar" ? category.name_ar : category.name_en}
              </h3>
            </div>
            <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesItems;
