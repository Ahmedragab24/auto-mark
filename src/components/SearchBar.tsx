"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useGetSearchByKeywordsQuery } from "@/store/apis/search";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import type {
  AllProductsType,
  CategoryCarsType,
  countryType,
  ProductType,
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

interface IProps {
  className?: string;
  inOpenChange?: (open: boolean) => void;
}

const SearchBar = ({ className, inOpenChange }: IProps) => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { Categories, Country, Language, AllProductsType } = useAppSelector(
    (state: RootState) => state
  );
  const { data, isLoading } = useGetSearchByKeywordsQuery(
    {
      categoryID: Categories.Categories.id,
      countryID: Country.Country.id,
      keyword: debouncedSearchText,
      page: 1,
      lang: Language.language,
      more_type: AllProductsType.allProductsType,
    },
    { skip: !debouncedSearchText }
  );
  const { Countries } = useCountriesData();
  const { Category } = useCategoriesData();

  const products = data?.data?.products?.data || [];
  const searchRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [Language.language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchText) {
      setIsOpen(true);
    }
  }, [debouncedSearchText]);

  const handleCountryChange = (value: string) => {
    const selectedCountry = Countries.find(
      (Country: countryType) => Country.name_en === value
    );
    if (selectedCountry) {
      dispatch(setCountry(selectedCountry));
    }
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = Category.find(
      (Category: CategoryCarsType) => Category.name === value
    );
    if (selectedCategory) {
      dispatch(setCategories(selectedCategory));
    }
  };

  const handleAllProductsChange = (value: string) => {
    const selectedAllProducts = AllProductsTypes.find(
      (Category) => Category.value === value
    );
    if (selectedAllProducts) {
      dispatch(
        setAllProductsType(selectedAllProducts.value as AllProductsType)
      );
    }
  };

  if (!isClient) return null;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <Input
        type="search"
        placeholder={
          Language.language === "en"
            ? "Search for cars and more..."
            : "ابحث عن السيارات وأكثر..."
        }
        className={`w-full !text-bodyS md:!text-sm border-gray-300 rounded-lg h-14 ${
          Language.language === "en" ? "text-left pl-14" : "text-right pr-14"
        }`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      <Button
        className="absolute top-0 left-0 px-4 rounded-l-lg h-14"
        onClick={() => setIsOpen(false)}
      >
        <Search className="w-5 h-5" />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"link"}
            className="absolute top-0 right-0 px-4 rounded-r-lg h-14 duration-200 "
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
              options={
                Countries
                  ? Countries.map((Country: countryType) => ({
                      id: Country.id,
                      name_ar: Country.name_ar,
                      name_en: Country.name_en,
                      value:
                        Language.language === "ar"
                          ? Country.name_ar
                          : Country.name_en,
                    }))
                  : []
              }
            />

            <SelectWrapper
              placeholder={
                Language.language === "ar" ? "اختر النوع" : "Select the type"
              }
              value={Categories.Categories.name}
              options={Category.map((category: CategoryCarsType) => ({
                name: category.name,
                value: category.name,
              }))}
              onValueChange={handleCategoryChange}
            />

            <SelectWrapper
              placeholder={
                Language.language === "ar" ? "اختر التصنيف" : "Select category"
              }
              value={AllProductsType.allProductsType}
              options={AllProductsTypes.map((item) => ({
                name: Language.language === "ar" ? item.name_ar : item.name_en,
                value: item.value,
              }))}
              onValueChange={handleAllProductsChange}
            />
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && debouncedSearchText && (
        <Card className="absolute z-50 w-full mt-2 overflow-hidden border-2 top-16 border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-4 text-center">
                {Language.language === "en"
                  ? "Please Wait..."
                  : "يرجى الانتظار..."}
              </p>
            ) : products.length > 0 ? (
              <ScrollArea
                className={`w-full max-h-[300px] ${
                  products.length < 4 ? "h-fit" : "h-[50vh]"
                }`}
                dir={Language.language === "ar" ? "rtl" : "ltr"}
              >
                <ul className="divide-y">
                  {products.map((product: ProductType) => (
                    <Link
                      key={product.id}
                      href={`/categories/${product.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        inOpenChange?.(false);
                      }}
                    >
                      <li className="flex gap-2 items-center p-4 cursor-pointer hover:bg-secondary">
                        <Image
                          src={
                            `${
                              process.env.NEXT_PUBLIC_BASE_URL ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }${product.image}` || "/placeholder.png"
                          }
                          alt={product.name || "images"}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                        <div className="flex-grow mr-4">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-500">
                              {product.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.country?.symbol}
                            </p>
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="p-4 text-center">لا توجد نتائج</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
