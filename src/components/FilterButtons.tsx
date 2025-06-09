"use client";

import { useCallback, memo, useState, useEffect } from "react";
import { useGetCategoriesByCarsQuery } from "@/store/apis/categories";
import { Button } from "./ui/button";
import type { CategoryCarsType } from "@/types";
import SkeletonBtn from "./SkeletonBtn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories } from "@/store/features/categories";
import type { RootState } from "@/store/store";
import { setCurrentPage } from "@/store/features/currentPage";
import { clearFilters } from "@/store/features/filter";
import {
  setAllProductsType,
  clearAllProductsType,
} from "@/store/features/AllProductsType";
import { clearCity } from "@/store/features/city";
import { clearBrand } from "@/store/features/attributes/brand";
import { clearModel } from "@/store/features/attributes/model";
import { clearBodyType } from "@/store/features/attributes/bodyType";
import { clearFuel } from "@/store/features/attributes/fuelType";
import { clearNumOfCylinders } from "@/store/features/attributes/numOfCylinders";
import { clearNumOfSeats } from "@/store/features/attributes/numOfSeats";
import { clearSpecific } from "@/store/features/attributes/specifications";
import { clearHorsePower } from "@/store/features/attributes/horsepower";
import { clearAutoParts } from "@/store/features/attributes/autoParts";
import { clearYear } from "@/store/features/attributes/year";
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
import { clearAge } from "@/store/features/attributes/age";
import { clearWeight } from "@/store/features/attributes/weight";
import { clearHeight } from "@/store/features/attributes/height";
import { clearMileage } from "@/store/features/attributes/mileage";

interface IProps {
  className?: string;
}

const FilterButtons = ({ className }: IProps) => {
  const { id } = useAppSelector(
    (state: RootState) => state.Categories.Categories
  );
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data, isLoading, isError } = useGetCategoriesByCarsQuery(language);
  const categories = data?.data?.categoriesWithSubcategories || [];
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  // Memoize the handler function to prevent unnecessary re-renders
  const handlerBtn = useCallback(
    (item: CategoryCarsType) => {
      // Batch all dispatch actions for better performance
      // This prevents multiple re-renders
      dispatch((dispatch) => {
        dispatch(setAllProductsType("category"));
        dispatch(setCategories(item));
        dispatch(setCurrentPage(1));
        dispatch(clearFilters());

        // Clear all attribute filters
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
        dispatch(clearAge());
        dispatch(clearWeight());
        dispatch(clearHeight());
        dispatch(clearCity());
        dispatch(clearMileage());
        dispatch(clearAllProductsType());
      });
    },
    [dispatch]
  );

  if (!isClient) return null;

  return (
    <div
      className={`flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mb-2 ${className} ${
        isLoading ? "!mb-4" : ""
      }`}
      role="group"
      aria-label="Category filters"
    >
      {/* Skeleton loading state */}
      {isLoading && <SkeletonBtn count={4} />}

      {/* Error state with retry button */}
      {isError && (
        <div className="text-center py-8 w-full">
          <p className="text-2xl font-semibold mb-4">عذرا حدث خطاء ما.</p>
        </div>
      )}

      {/* Render category buttons */}
      {!isLoading &&
        !isError &&
        categories.length > 0 &&
        categories.map((item: CategoryCarsType) => (
          <Button
            key={item.id}
            variant={item.id === id ? "default" : "secondary"}
            className="px-3 md:px-8 text-sm md:text-md"
            onClick={() => handlerBtn(item)}
            aria-pressed={item.id === id}
          >
            {item.name}
          </Button>
        ))}

      {/* Empty state */}
      {!isLoading && !isError && categories.length === 0 && (
        <p className="text-center w-full py-4">لا توجد فئات متاحة</p>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FilterButtons);
