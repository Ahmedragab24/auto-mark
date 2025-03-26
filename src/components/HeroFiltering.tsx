"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { price, year } from "@/constants";
import dynamic from "next/dynamic";
import { useCitiesData } from "@/hooks/use-citiesData";
import type { BrandType, CategoryCarsType, cityType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setCategories } from "@/store/features/categories";
import { useGetBrandsQuery } from "@/store/apis/attrbuite";
import {
  clearYear,
  setYear,
  type YearType,
} from "@/store/features/attributes/year";
import { clearBrand, setBrand } from "@/store/features/attributes/brand";
import {
  clearFilters,
  setPriceRange,
  setSingleFilter,
} from "@/store/features/filter";
import { useRouter } from "next/navigation";
import { clearCity, setCity } from "@/store/features/city";
import { useCategoriesData } from "@/hooks/use-categoriesData";
import { clearModel } from "@/store/features/attributes/model";
import { clearBodyType } from "@/store/features/attributes/bodyType";
import { clearFuel } from "@/store/features/attributes/fuelType";
import { clearNumOfCylinders } from "@/store/features/attributes/numOfCylinders";
import { clearNumOfSeats } from "@/store/features/attributes/numOfSeats";
import { clearSpecific } from "@/store/features/attributes/specifications";
import { clearHorsePower } from "@/store/features/attributes/horsepower";
import { clearAutoParts } from "@/store/features/attributes/autoParts";
import { clearEngineCount } from "@/store/features/attributes/engineCount";
import { clearCondition } from "@/store/features/attributes/condition";
import { clearMotoEngine } from "@/store/features/attributes/motoEngine";
import {
  clearColorExterior,
  clearColorInterior,
} from "@/store/features/attributes/colors";
import { clearNumOfTries } from "@/store/features/attributes/numOfTries";
import { clearPowerTransSys } from "@/store/features/attributes/powerTransmissionSystem";
import { clearSubSections } from "@/store/features/attributes/subSections";
import { setCurrentPage } from "@/store/features/currentPage";
import { clearMileage } from "@/store/features/attributes/mileage";
import { clearAge } from "@/store/features/attributes/age";
import { clearHeight } from "@/store/features/attributes/height";
import { clearWeight } from "@/store/features/attributes/weight";
import { setCountry } from "@/store/features/country";
import { clearAllProductsType } from "@/store/features/AllProductsType";
import { resetSorting } from "@/store/features/sortingData";
import { clearServicesSections } from "@/store/features/attributes/servicesSections";
import { clearAutoPartsCategories } from "@/store/features/attributes/autoPartsCategories";
import { clearModelName } from "@/store/features/attributes/modelName";
import { setCarType } from "@/store/features/carType";
import { clearBrandName } from "@/store/features/attributes/brandName";

const SelectWrapper = dynamic(() => import("@/components/SelectWrapper"), {
  ssr: false,
});

const HeroFiltering: React.FC = () => {
  const { Language, Categories } = useAppSelector((state: RootState) => state);
  const { Cities } = useCitiesData();
  const { Category } = useCategoriesData();
  const { data: dataBrands } = useGetBrandsQuery({
    id: Categories.Categories.id,
  });
  const dispatch = useAppDispatch();
  const Router = useRouter();
  const Brands = dataBrands?.data?.brands || [];
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(clearFilters());
    dispatch(clearBrand());
    dispatch(clearModel());
    dispatch(clearBodyType());
    dispatch(clearFuel());
    dispatch(clearNumOfCylinders());
    dispatch(clearNumOfSeats());
    dispatch(clearSpecific());
    dispatch(clearHorsePower());
    dispatch(clearAutoParts());
    dispatch(clearYear());
    dispatch(clearEngineCount());
    dispatch(clearCondition());
    dispatch(clearMotoEngine());
    dispatch(clearColorExterior());
    dispatch(clearColorInterior());
    dispatch(clearNumOfTries());
    dispatch(clearPowerTransSys());
    dispatch(clearSubSections());
    dispatch(setCurrentPage(1));
    dispatch(clearMileage());
    dispatch(clearAge());
    dispatch(clearHeight());
    dispatch(clearWeight());
    dispatch(clearCity());
    dispatch(clearAllProductsType());
    dispatch(clearServicesSections());
    dispatch(clearAutoPartsCategories());
    dispatch(
      setCountry({
        id: 1,
        name_ar: "الإمارات العربية المتحدة",
        name_en: "United Arab Emirates",
      })
    );
    dispatch(
      setCarType({
        id: 1,
        key: "car",
        name: "Cars",
      })
    );
    dispatch(resetSorting());
    dispatch(clearBrandName());
    dispatch(clearModelName());
  }, [dispatch]);

  const handleCityChange = (value: string) => {
    // Then set the selected city
    const selectedCity = Cities?.find(
      (city: cityType) => city.name_en === value || city.name_ar === value
    );

    if (selectedCity) {
      dispatch(setCity(selectedCity));
      dispatch(setSingleFilter({ category: "cities", option: selectedCity }));
    } else {
      dispatch(clearCity());
    }
  };

  const handleCategoryChange = (value: string) => {
    // Then set the selected category
    const selectedCategory = Category?.find(
      (category: CategoryCarsType) => category.name === value
    );
    if (selectedCategory) {
      dispatch(setCategories(selectedCategory));
    }
  };

  const handleYearChange = (value: string) => {
    // Then set the selected year
    const selectedYear = year.find((y: YearType) => y.name === value);
    if (selectedYear) {
      dispatch(setYear(selectedYear));
      dispatch(
        setSingleFilter({
          category: "manufacturing_year",
          option: { ...selectedYear, id: selectedYear.id.toString() },
        })
      );
    } else {
      dispatch(clearYear());
    }
  };

  const handleBrandChange = (value: string) => {
    // Then set the selected brand
    const selectedBrand = Brands?.find(
      (brand: BrandType) => brand.name_en === value || brand.name_ar === value
    );

    if (selectedBrand) {
      dispatch(setBrand(selectedBrand));
      dispatch(setSingleFilter({ category: "brand", option: selectedBrand }));
    } else {
      dispatch(clearBrand());
    }
  };

  const handlePriceChange = (value: string) => {
    // Then set the selected price
    const selectedPrice = price.find((p) => p.name === value);
    if (selectedPrice) {
      const [min, max] = selectedPrice.value.split("-").map(Number);
      dispatch(setPriceRange([min, max]));
    }
  };

  const handleFilter = () => {
    Router.push("/categories/car");
  };

  if (!isClient) return null;

  return (
    <div className="relative z-10 flex justify-center">
      <div className="w-full md:max-w-4xl p-4 shadow-lg rounded-xl bg-background/40">
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
          dir={Language.language === "ar" ? "rtl" : "ltr"}
        >
          <SelectWrapper
            placeholder={
              Language.language === "ar" ? "اختر المدينة" : "Select city"
            }
            onValueChange={handleCityChange}
            options={
              Cities
                ? Cities.map((city: cityType) => ({
                    name:
                      Language.language === "ar" ? city.name_ar : city.name_en,
                    value: city.name_en,
                  }))
                : []
            }
          />
          <SelectWrapper
            placeholder={
              Language.language === "ar" ? "اختر النوع" : "Select the type"
            }
            options={
              Category?.map((category: CategoryCarsType) => ({
                name: category.name,
                value: category.name,
              })) || []
            }
            onValueChange={handleCategoryChange}
          />
          <SelectWrapper
            placeholder={
              Language.language === "ar" ? "اختر الماركة" : "Select brand"
            }
            options={
              Brands?.map((brand: BrandType) => ({
                name:
                  Language.language === "ar" ? brand.name_ar : brand.name_en,
                value: brand.name_en,
              })) || []
            }
            onValueChange={handleBrandChange}
          />
          <SelectWrapper
            placeholder={
              Language.language === "ar" ? "اختر السعر" : "Select price"
            }
            options={price.map((p) => ({
              name: p.name,
              value: p.name,
            }))}
            onValueChange={handlePriceChange}
          />
          <SelectWrapper
            placeholder={
              Language.language === "ar" ? "اختر السنة" : "Select year"
            }
            options={year.map((y) => ({
              name: y.name,
              value: y.name,
            }))}
            onValueChange={handleYearChange}
          />
          <Button
            size="lg"
            className="h-12 flex items-center justify-center"
            onClick={handleFilter}
          >
            <Search className={Language.language === "ar" ? "ml-2" : "mr-2"} />
            {Language.language === "ar" ? "ابحث" : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroFiltering);
