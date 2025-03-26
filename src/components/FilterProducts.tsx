"use client";

import type React from "react";
import { useEffect, useMemo } from "react";
import ProductsGrid from "./ProductsGrid";
import PaginationProducts from "./PaginationProducts";
import ShowroomGrid from "./ShowroomGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProductsNumber } from "@/store/features/productsNumber";
import type { CategoriesKeyType } from "@/types";
import SortSelect from "./Sorting";
import { useProductData } from "@/hooks/use-productsData";
import { useFilteringDataList } from "@/hooks/use-FilteringDataList";

interface FilterProductsProps {
  typeCategory: CategoriesKeyType;
}

const FilterProducts: React.FC<FilterProductsProps> = ({ typeCategory }) => {
  const dispatch = useAppDispatch();
  const {
    currentPage,
    filters,
    City,
    Brand,
    Model,
    SubSections,
    Year,
    Sorting,
    Color,
    AutoParts,
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
    ServicesSections,
    AutoPartsCategories,
  } = useAppSelector((state) => ({
    currentPage: state.CurrentPage.currentPage,
    filters: state.filters,
    City: state.City.City,
    Brand: state.Brand,
    Model: state.Model,
    SubSections: state.SubSections,
    Year: state.Year,
    Sorting: state.Sorting.sort_by,
    Color: state.Colors,
    AutoParts: state.AutoParts,
    BodyType: state.BodyType,
    FuelType: state.FuelType,
    EngineCount: state.EngineCount,
    HorsePower: state.HorsePower,
    NumOfCylinders: state.NumOfCylinders,
    NumOfSeats: state.NumOfSeats,
    Condition: state.Condition,
    PowerTransSysType: state.PowerTransSysType,
    MotoEngineType: state.MotoEngineType,
    NumOfTries: state.NumOfTries,
    Age: state.Age,
    Height: state.Height,
    Weight: state.Weight,
    Mileage: state.Mileage,
    ServicesSections: state.ServicesSections,
    AutoPartsCategories: state.AutoPartsCategories,
  }));

  const { products, isError, isLoading, totalItems, totalPages } =
    useProductData(typeCategory, currentPage);
  const filteredData = useFilteringDataList(typeCategory, currentPage);

  const isFiltered = useMemo(
    () =>
      !!(filters && filters.priceRange && filters.selectedFilters) ||
      !!(City && City.id) ||
      !!(Brand && Brand.id) ||
      !!(Model && Model.id) ||
      !!(Year && Year.name_en) ||
      !!Color ||
      !!AutoParts ||
      !!AutoPartsCategories ||
      !!BodyType ||
      !!FuelType ||
      !!EngineCount ||
      !!HorsePower ||
      !!NumOfCylinders ||
      !!NumOfSeats ||
      !!Condition ||
      !!PowerTransSysType ||
      !!MotoEngineType ||
      !!NumOfTries ||
      !!Age ||
      !!Height ||
      !!Weight ||
      !!Mileage ||
      !!(SubSections && SubSections.id) ||
      (!!ServicesSections && ServicesSections.id) ||
      !!Sorting,
    [
      filters,
      Brand,
      Model,
      Year,
      SubSections,
      Sorting,
      City,
      Color,
      AutoParts,
      AutoPartsCategories,
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
      ServicesSections,
    ]
  );

  const productsToDisplay = useMemo(
    () => (isFiltered ? filteredData.products : products),
    [isFiltered, filteredData.products, products]
  );

  const errorToDisplay = useMemo(
    () => (isFiltered ? filteredData.isError : isError),
    [isFiltered, filteredData.isError, isError]
  );

  const loadingToDisplay = useMemo(
    () => (isFiltered ? filteredData.isLoading : isLoading),
    [isFiltered, filteredData.isLoading, isLoading]
  );

  const totalPagesToDisplay = useMemo(
    () => (isFiltered ? filteredData.totalPages : totalPages),
    [isFiltered, filteredData.totalPages, totalPages]
  );

  // Update product count in Redux store
  useEffect(() => {
    let totalItemsToSet;

    // For showrooms, always use the totalItems from the showroom data
    if (typeCategory === "showroom" || typeCategory === "showroomInfo") {
      totalItemsToSet = totalItems;
    } else {
      // For other categories, use filtered data if filtering is applied
      totalItemsToSet = isFiltered ? filteredData.totalItems : totalItems;
    }

    // Dispatch the action to update the product count in Redux
    dispatch(setProductsNumber(totalItemsToSet));
  }, [dispatch, isFiltered, totalItems, filteredData.totalItems, typeCategory]);

  const memoizedProductsGrid = useMemo(
    () => (
      <ProductsGrid
        products={productsToDisplay || []}
        isError={errorToDisplay}
        isLoading={loadingToDisplay}
      />
    ),
    [productsToDisplay, errorToDisplay, loadingToDisplay]
  );

  const memoizedShowroomGrid = useMemo(
    () => (
      <ShowroomGrid
        products={products || []}
        isError={isError}
        isLoading={isLoading}
      />
    ),
    [products, isError, isLoading]
  );

  const shouldShowBrandSelect = useMemo(
    () =>
      typeCategory !== "showroom" &&
      productsToDisplay &&
      productsToDisplay.length > 0,
    [typeCategory, productsToDisplay]
  );

  // Always render pagination for showrooms, regardless of product count
  const shouldShowPagination = useMemo(() => {
    if (typeCategory === "showroom" || typeCategory === "showroomInfo") {
      return totalPages > 1;
    }
    return totalPagesToDisplay > 1;
  }, [typeCategory, totalPagesToDisplay, totalPages]);

  return (
    <div className="flex flex-col gap-2 pb-8" dir="ltr">
      {shouldShowBrandSelect && <SortSelect />}

      {typeCategory !== "showroom" &&
        typeCategory !== "showroomInfo" &&
        memoizedProductsGrid}

      {(typeCategory === "showroom" || typeCategory === "showroomInfo") &&
        memoizedShowroomGrid}

      {/* Always render the pagination component, it will handle visibility internally */}
      <PaginationProducts
        totalPages={
          shouldShowPagination
            ? typeCategory === "showroom" || typeCategory === "showroomInfo"
              ? totalPages
              : totalPagesToDisplay
            : 0
        }
      />
    </div>
  );
};

export default FilterProducts;
