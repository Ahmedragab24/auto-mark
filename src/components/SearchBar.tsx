"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Input } from "./ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useGetSearchByBrandQuery } from "@/store/apis/search";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type {
  AllProductsType,
  BrandType,
  CategoryCarsType,
  countryType,
  ModelsType,
} from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectWrapper from "./SelectWrapper";
import { useCountriesData } from "@/hooks/use-countriesData";
import { setCountry } from "@/store/features/country";
import { useCategoriesData } from "@/hooks/use-categoriesData";
import { setCategories } from "@/store/features/categories";
import { AllProductsTypes } from "@/constants";
import { setAllProductsType } from "@/store/features/AllProductsType";
import { setBrand } from "@/store/features/attributes/brand";
import { setModel } from "@/store/features/attributes/model";
import { setCurrentPage } from "@/store/features/currentPage";
import { setSingleFilter } from "@/store/features/filter";

interface IProps {
  className?: string;
  inOpenChange?: (open: boolean) => void;
}

interface SearchResultItem {
  brandId: number;
  brandName_en: string;
  brandName_ar: string;
  brandImage: string;
  modelID: number;
  modelName_en: string;
  modelName_ar: string;
}

const SearchBar = ({ className, inOpenChange }: IProps) => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { Categories, Country, Language, AllProductsType } = useAppSelector(
    (state: RootState) => state
  );
  const { Countries } = useCountriesData();
  const { Category } = useCategoriesData();

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize search parameters
  const searchParams = useMemo(
    () => ({
      categoryID: Categories.Categories.id,
      keyword: debouncedSearchText,
    }),
    [Categories.Categories.id, debouncedSearchText]
  );

  const { data, isLoading, error } = useGetSearchByBrandQuery(searchParams, {
    refetchOnMountOrArgChange: true,
  });

  // Process and flatten search results
  const searchResults = useMemo((): SearchResultItem[] => {
    if (!data?.data?.brands?.length) {
      return [];
    }

    const results: SearchResultItem[] = [];

    data.data.brands.forEach((brand: BrandType) => {
      if (brand.model_brands?.length) {
        brand.model_brands.forEach((model: ModelsType) => {
          results.push({
            brandId: brand.id,
            brandName_en: brand.name_en,
            brandName_ar: brand.name_ar,
            brandImage: brand.image || "",
            modelID: model.id,
            modelName_en: model.name_en,
            modelName_ar: model.name_ar,
          });
        });
      }
    });

    return results;
  }, [data]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        inOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, inOpenChange]);

  // Open dropdown when there's search text
  useEffect(() => {
    if (debouncedSearchText && debouncedSearchText.length >= 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedSearchText]);

  // Memoized event handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const handleSearchFocus = useCallback(() => {
    if (debouncedSearchText && debouncedSearchText.length >= 2) {
      setIsOpen(true);
    }
  }, [debouncedSearchText]);

  const handleSearchClick = useCallback(() => {
    if (searchText.trim()) {
      // Trigger search action
      console.log("Search clicked:", searchText);
    }
  }, [searchText]);

  const handleCountryChange = useCallback(
    (value: string) => {
      const selectedCountry = Countries?.find(
        (country: countryType) => country.name_en === value
      );
      if (selectedCountry) {
        dispatch(setCountry(selectedCountry));
      }
    },
    [Countries, dispatch]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      const selectedCategory = Category?.find(
        (category: CategoryCarsType) => category.name === value
      );
      if (selectedCategory) {
        dispatch(setCategories(selectedCategory));
      }
    },
    [Category, dispatch]
  );

  const handleAllProductsChange = useCallback(
    (value: string) => {
      const selectedAllProducts = AllProductsTypes.find(
        (category) => category.value === value
      );
      if (selectedAllProducts) {
        dispatch(
          setAllProductsType(selectedAllProducts.value as AllProductsType)
        );
      }
    },
    [dispatch]
  );

  const handleResultClick = useCallback(
    (result: SearchResultItem) => {
      setIsOpen(false);
      setSearchText("");
      setDebouncedSearchText("");
      inOpenChange?.(false);
      dispatch(
        setBrand({
          id: result.brandId,
          name_en: result.brandName_en,
          name_ar: result.brandName_ar,
          image: result.brandImage,
          category_id: 1,
        })
      );
      dispatch(
        setModel({
          id: result.modelID,
          name_en: result.modelName_en,
          name_ar: result.modelName_ar,
          brand_id: result.brandId,
        })
      );

      dispatch(setCurrentPage(1));
      dispatch(
        setSingleFilter({
          category: "brand",
          option: {
            id: result.brandId.toString(),
            name_ar: result.brandName_ar,
            name_en: result.brandName_en,
            name: result.brandName_en,
            value: result.brandId.toString(),
          },
        })
      );
      dispatch(
        setSingleFilter({
          category: "model",
          option: {
            id: result.modelID.toString(),
            name_ar: result.modelName_ar,
            name_en: result.modelName_en,
            name: result.modelName_en,
            value: result.modelID.toString(),
          },
        })
      );
    },
    [inOpenChange, dispatch]
  );

  // Memoized computed values
  const placeholderText = useMemo(() => {
    return Language.language === "en"
      ? "Search for cars and more..."
      : "ابحث عن السيارات وأكثر...";
  }, [Language.language]);

  const inputStyles = useMemo(() => {
    const isRTL = Language.language === "ar";
    return `w-full !text-bodyS md:!text-sm border-gray-300 rounded-lg h-14 ${
      isRTL ? "text-right pr-14" : "text-left pl-14"
    }`;
  }, [Language.language]);

  const countryOptions = useMemo(() => {
    if (!Countries) return [];

    return Countries.map((country: countryType) => ({
      id: country.id,
      name_ar: country.name_ar,
      name_en: country.name_en,
      value: Language.language === "ar" ? country.name_ar : country.name_en,
    }));
  }, [Countries, Language.language]);

  const categoryOptions = useMemo(() => {
    if (!Category) return [];

    return Category.map((category: CategoryCarsType) => ({
      name: category.name,
      value: category.name,
    }));
  }, [Category]);

  const allProductsOptions = useMemo(() => {
    return AllProductsTypes.map((item) => ({
      name: Language.language === "ar" ? item.name_ar : item.name_en,
      value: item.value,
    }));
  }, [Language.language]);

  // Don't render on server
  if (!isClient) return null;

  return (
    <div className={`relative ${className || ""}`} ref={searchRef}>
      <Input
        type="search"
        placeholder={placeholderText}
        className={inputStyles}
        value={searchText}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        aria-label={placeholderText}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />

      <Button
        type="button"
        className="absolute top-0 left-0 px-4 rounded-l-lg h-14"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="absolute top-0 right-0 px-4 rounded-r-lg h-14 duration-200"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col justify-center items-center gap-2 text-center">
            <DialogTitle className="flex items-center gap-2">
              {Language.language === "ar" ? "تصفية" : "Filter"}
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </DialogTitle>
            <DialogDescription className="max-w-[80%] text-center">
              {Language.language === "ar"
                ? "ابحث عن نوع المركبة التي تريد مستعملة كانت او جديدة."
                : "Search for the type of vehicle you want, whether used or new."}
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            dir={Language.language === "ar" ? "rtl" : "ltr"}
          >
            <SelectWrapper
              placeholder={
                Language.language === "ar"
                  ? "اختر الدولة"
                  : "Select the country"
              }
              value={
                Language.language === "ar"
                  ? Country.Country.name_ar
                  : Country.Country.name_en
              }
              defaultValue={
                Language.language === "ar"
                  ? Country.Country.name_ar
                  : Country.Country.name_en
              }
              onValueChange={handleCountryChange}
              options={countryOptions}
            />

            <SelectWrapper
              placeholder={
                Language.language === "ar" ? "اختر النوع" : "Select the type"
              }
              value={Categories.Categories.name}
              options={categoryOptions}
              onValueChange={handleCategoryChange}
            />

            <SelectWrapper
              placeholder={
                Language.language === "ar" ? "اختر التصنيف" : "Select category"
              }
              value={AllProductsType.allProductsType}
              options={allProductsOptions}
              onValueChange={handleAllProductsChange}
            />
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && debouncedSearchText && (
        <Card className="absolute z-50 w-full mt-2 overflow-hidden border-2 top-16 border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center" role="status" aria-live="polite">
                <p>
                  {Language.language === "en"
                    ? "Please Wait..."
                    : "يرجى الانتظار..."}
                </p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500" role="alert">
                <p>
                  {Language.language === "en"
                    ? "Error loading results"
                    : "خطأ في تحميل النتائج"}
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <ScrollArea
                className={`w-full max-h-[300px] ${
                  searchResults.length < 4 ? "h-fit" : "h-[50vh]"
                }`}
                dir={Language.language === "ar" ? "rtl" : "ltr"}
              >
                <ul className="divide-y" role="listbox">
                  {searchResults.map((result) => (
                    <li
                      key={`${result.brandId}-${result.modelID}`}
                      role="option"
                      aria-selected="false"
                    >
                      <Link
                        href={`/categories/car`}
                        onClick={() => handleResultClick(result)}
                        className="flex gap-2 items-center p-4 cursor-pointer hover:bg-secondary transition-colors duration-200 focus:bg-secondary focus:outline-none"
                      >
                        {/* <div className="flex-shrink-0">
                          <Image
                            src={
                              result.brandImage
                                ? `${process.env.NEXT_PUBLIC_BASE_URL}${result.brandImage}`
                                : "/placeholder.svg?height=50&width=50"
                            }
                            alt={`${result.brandName_en} logo`}
                            width={50}
                            height={50}
                            className="object-cover rounded"
                            loading="lazy"
                          />
                        </div> */}
                        <div className="flex gap-2 mx-4 min-w-0 flex-1">
                          <h3 className="font-semibold truncate">
                            {Language.language === "en"
                              ? result.brandName_en
                              : result.brandName_ar}
                          </h3>
                          <h3 className="font-semibold truncate">
                            {Language.language === "en"
                              ? result.modelName_en
                              : result.modelName_ar}
                          </h3>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center" role="status">
                <p>
                  {Language.language === "en" ? "No Results" : "لا يوجد نتائج"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
