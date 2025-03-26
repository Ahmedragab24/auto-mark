"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useGetCategoryProductsQuery,
  useGetHomeProductsQuery,
} from "@/store/apis/products";
import { useGetShowroomsProductsQuery } from "@/store/apis/showrooms";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { CategoriesKeyType } from "@/types";

interface ProductData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  isError?: boolean;
  isLoading?: boolean;
  totalItems: number;
  totalPages: number;
}

export const useProductData = (
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

  const { Country, Language, Categories, CarType, City } = useAppSelector(
    (state: RootState) => ({
      Country: state.Country.Country,
      Language: state.Language.language,
      Categories: state.Categories.Categories,
      CarType: state.CarType.Categories,
      City: state.City.City,
    })
  );

  const {
    data: categoryData,
    isError: categoryError,
    isLoading: categoryLoading,
  } = useGetCategoryProductsQuery({
    page: currentPage,
    countryId: Country.id,
    categoryId: Categories.id,
    lang: Language,
  });

  const {
    data: homeData,
    isError: homeError,
    isLoading: homeLoading,
  } = useGetHomeProductsQuery({
    page: currentPage,
    lang: Language,
    countryId: Country.id,
  });

  // Create the query parameters object with conditional cityId
  const showroomsQueryParams = {
    page: currentPage,
    countryId: Country.id,
    lang: Language,
    categoryId: CarType.id,
    // Only include cityId if CarType is true (has a truthy value) AND City.id exists
    ...(CarType.id && City.id ? { cityId: City.id } : {}),
  };

  const {
    data: showroomsData,
    isError: showroomsError,
    isLoading: showroomsLoading,
  } = useGetShowroomsProductsQuery(showroomsQueryParams);

  const updateProductData = useCallback(() => {
    let newProductData: ProductData = {
      products: [],
      isError: false,
      isLoading: true,
      totalItems: 0,
      totalPages: 0,
    };

    switch (typeCategory) {
      case "car":
        newProductData = {
          products: categoryData?.data || [],
          isError: categoryError,
          isLoading: categoryLoading,
          totalItems: categoryData?.total || 0,
          totalPages: categoryData?.last_page || 0,
        };
        break;
      case "scrap":
      case "services":
      case "spare_parts":
      case "car_numbers":
        const index = [
          "scrap",
          "services",
          "spare_parts",
          "car_numbers",
        ].indexOf(typeCategory);
        newProductData = {
          products:
            homeData?.data?.categories_with_products_tow?.[index]?.products ||
            [],
          isError: homeError,
          isLoading: homeLoading,
          totalItems:
            homeData?.data?.categories_with_products_tow?.[index]?.total || 0,
          totalPages:
            homeData?.data?.categories_with_products_tow?.[index]?.last_page ||
            0,
        };
        break;
      case "showroom":
        newProductData = {
          products: showroomsData?.data?.showrooms?.data || [],
          isError: showroomsError,
          isLoading: showroomsLoading,
          totalItems: showroomsData?.data?.showrooms?.total || 0,
          totalPages: showroomsData?.data?.showrooms?.last_page || 0,
        };
        break;
      default:
        console.error(`Unsupported category type: ${typeCategory}`);
    }

    setProductData(newProductData);
  }, [
    typeCategory,
    categoryData,
    homeData,
    showroomsData,
    categoryError,
    homeError,
    showroomsError,
    categoryLoading,
    homeLoading,
    showroomsLoading,
  ]);

  useEffect(() => {
    // Force refetch when Country changes
    updateProductData();
  }, [
    updateProductData,
    Country.id, // Add explicit dependency on Country.id
    Language, // Add explicit dependency on Language
    Categories.id, // Add explicit dependency on Categories.id
    CarType.id, // Add explicit dependency on CarType.id
    City.id, // Add explicit dependency on City.id
    currentPage, // Add explicit dependency on currentPage
  ]);

  return productData;
};
