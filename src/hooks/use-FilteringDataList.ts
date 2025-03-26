"use client";

import { useState, useEffect } from "react";
import { useAdvancedSearchMutation } from "@/store/apis/filtering";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { CategoriesKeyType } from "@/types";

interface ProductData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  isError: boolean;
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
}

export const useFilteringDataList = (
  typeCategory: CategoriesKeyType,
  currentPage: number
): ProductData => {
  const [productData, setProductData] = useState<ProductData>({
    products: [],
    isError: false,
    isLoading: true,
    totalItems: 0,
    totalPages: 0,
  });

  const {
    Country,
    City,
    Language,
    Categories,
    AllProductsType,
    filters,
    Brand,
    Model,
    Colors,
    SubSections,
    Year,
    Specific,
    BodyType,
    FuelType,
    EngineCount,
    HorsePower,
    NumOfCylinders,
    NumOfSeats,
    Condition,
    PowerTransSysType,
    MotoEngineType,
    NumOfTries,
    Age,
    Height,
    Weight,
    Mileage,
    Sorting,
    ServicesSections,
    AutoParts,
    AutoPartsCategories,
  } = useAppSelector((state: RootState) => state);

  const [advancedSearch] = useAdvancedSearchMutation();

  useEffect(() => {
    const fetchData = async () => {
      const formData = {
        country_id: Country.Country.id,
        ...(City.City && { city_id: City.City.id }),
        category_id: Categories.Categories.id,
        brand_id: Brand.id,
        model_id: Model.id,
        sub_category_id: SubSections.id, // accept null
        more_type: AllProductsType.allProductsType,
        ...(filters &&
          filters.priceRange && {
            price_from: filters.priceRange[0],
            price_to: filters.priceRange[1],
          }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dynamic_filters: [] as any[],
        ...(Sorting.sort_by && { sort_by: Sorting.sort_by }),
      };

      if (Year.name) {
        formData.dynamic_filters.push({
          key: "manufacturing_year",
          type: "string",
          value: Year.name.toString(),
        });
      }
      if (Mileage.number) {
        formData.dynamic_filters.push({
          key: "mileage",
          type: "string",
          value: Mileage.number.toString(),
        });
      }
      if (Specific.name || Specific.name_en) {
        formData.dynamic_filters.push({
          key: "film_specifications",
          type: "string",
          value:
            Specific.name?.toString() || Specific.name_en?.toString() || "",
        });
      }
      if (FuelType.name || FuelType.name_en) {
        formData.dynamic_filters.push({
          key: "fuel_type",
          type: "string",
          value:
            FuelType.name?.toString() || FuelType.name_en?.toString() || "",
        });
      }
      if (Colors.exterior_color.name_en) {
        formData.dynamic_filters.push({
          key: "exterior_color",
          type: "string",
          value: Colors.exterior_color.name_en?.toString(),
        });
      }
      if (Colors.interior_color.name_en) {
        formData.dynamic_filters.push({
          key: "interior_color",
          type: "string",
          value: Colors.interior_color.name_en?.toString(),
        });
      }
      if (BodyType.name_en || BodyType.name_ar) {
        formData.dynamic_filters.push({
          key: "structure_type",
          type: "string",
          value: BodyType.name_ar || BodyType.name_en,
        });
      }
      if (EngineCount.name || EngineCount.name_en) {
        formData.dynamic_filters.push({
          key: "engine",
          type: "string",
          value:
            EngineCount.name?.toString() || EngineCount.name_en?.toString(),
        });
      }
      if (HorsePower.name || HorsePower.name_en) {
        formData.dynamic_filters.push({
          key: "horse_power",
          type: "string",
          value: HorsePower.name?.toString() || HorsePower.name_en?.toString(),
        });
      }
      if (NumOfSeats.name || NumOfSeats.name_en) {
        formData.dynamic_filters.push({
          key: "number_of_seats",
          type: "string",
          value: NumOfSeats.name?.toString() || NumOfSeats.name_en?.toString(),
        });
      }
      if (NumOfCylinders.name || NumOfCylinders.name_en) {
        formData.dynamic_filters.push({
          key: "cylinders",
          type: "number",
          value: NumOfCylinders.name || NumOfCylinders.name_en,
        });
      }
      if (PowerTransSysType.name || PowerTransSysType.name_en) {
        formData.dynamic_filters.push({
          key: "power_transmission_system",
          type: "string",
          value:
            PowerTransSysType.name?.toString() ||
            PowerTransSysType.name_en?.toString(),
        });
      }
      if (MotoEngineType.name || MotoEngineType.name_en) {
        formData.dynamic_filters.push({
          key: "moto_engine",
          type: "string",
          value:
            MotoEngineType.name?.toString() ||
            MotoEngineType.name_en?.toString(),
        });
      }
      if (NumOfTries.name || NumOfTries.name_en) {
        formData.dynamic_filters.push({
          key: "num_of_tries",
          type: "string",
          value: NumOfTries.name?.toString() || NumOfTries.name_en?.toString(),
        });
      }
      if (Condition.name || Condition.name_en) {
        formData.dynamic_filters.push({
          key: "condition",
          type: "string",
          value: Condition.name || Condition.name_en,
        });
      }
      if (Age.number) {
        formData.dynamic_filters.push({
          key: "age",
          type: "string",
          value: Age.number?.toString(),
        });
      }
      if (Height.number) {
        formData.dynamic_filters.push({
          key: "height",
          type: "string",
          value: Height.number?.toString(),
        });
      }
      if (Weight.number) {
        formData.dynamic_filters.push({
          key: "weight",
          type: "string",
          value: Weight.number?.toString(),
        });
      }
      if (ServicesSections.name_en) {
        formData.dynamic_filters.push({
          key: "service_category",
          type: "string",
          value: ServicesSections.value?.toString(),
        });
      }
      if (AutoParts.name_en) {
        formData.dynamic_filters.push({
          key: "auto_parts_type",
          type: "string",
          value: AutoParts.name_en?.toString(),
        });
      }
      if (AutoPartsCategories.name_en) {
        formData.dynamic_filters.push({
          key: "service_category",
          type: "string",
          value: AutoPartsCategories.name_en?.toString(),
        });
      }

      try {
        const result = await advancedSearch({
          formData,
          lang: Language.language,
          page: currentPage,
        }).unwrap();
        const data = result.data?.products;

        setProductData({
          products: data?.data || [],
          isError: false,
          isLoading: false,
          totalItems: data?.total || 0,
          totalPages: data?.last_page || 0,
        });
      } catch (error) {
        console.log(error);

        setProductData({
          products: [],
          isError: true,
          isLoading: false,
          totalItems: 0,
          totalPages: 0,
        });
      }
    };

    fetchData();
  }, [
    advancedSearch,
    AllProductsType,
    City.City,
    Country.Country.id,
    City.City.id,
    Categories.Categories.id,
    Language.language,
    currentPage,
    typeCategory,
    filters,
    Year,
    Brand.id,
    Model.id,
    Colors.exterior_color.name_en,
    Colors.interior_color.name_en,
    SubSections.id,
    Specific.name,
    Specific.name_en,
    FuelType.name,
    FuelType.name_en,
    BodyType.name,
    BodyType.name_en,
    BodyType.name_ar,
    EngineCount.name,
    EngineCount.name_en,
    HorsePower.name,
    HorsePower.name_en,
    NumOfSeats.name,
    NumOfSeats.name_en,
    NumOfCylinders.name,
    NumOfCylinders.name_en,
    Condition.name,
    Condition.name_en,
    PowerTransSysType.name,
    PowerTransSysType.name_en,
    MotoEngineType.name,
    MotoEngineType.name_en,
    NumOfTries.name,
    NumOfTries.name_en,
    Sorting.sort_by,
    Mileage.number,
    Height.number,
    Weight.number,
    Age.number,
    ServicesSections.name_en,
    ServicesSections.value,
    AutoParts.name_en,
    AutoPartsCategories.name_en,
  ]);

  return productData;
};
