"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPriceRange, setSingleFilter } from "@/store/features/filter";
import { setBrand, clearBrand } from "@/store/features/attributes/brand";
import { clearModel, setModel } from "@/store/features/attributes/model";
import {
  clearSubSections,
  setSubSections,
} from "@/store/features/attributes/subSections";
import type { BrandType } from "@/store/features/attributes/brand";
import type { ModelsType } from "@/store/features/attributes/model";
import {
  clearColorExterior,
  clearColorInterior,
  setColorExterior,
  setColorInterior,
  type ColorType,
} from "@/store/features/attributes/colors";
import type { SubSectionsType } from "@/store/features/attributes/subSections";
import PriceRangeSelector from "./price-range-selector";
import type {
  AllProductsType,
  AttributesKeyType,
  CategoryCarsType,
  cityType,
  countryType,
  ServicesSectionType,
} from "@/types";
import { setCurrentPage } from "@/store/features/currentPage";
import {
  clearYear,
  setYear,
  type YearType,
} from "@/store/features/attributes/year";
import {
  clearSpecific,
  setSpecific,
  type SpecificType,
} from "@/store/features/attributes/specifications";
import {
  clearFuel,
  type FuelType,
  setFuel,
} from "@/store/features/attributes/fuelType";
import {
  type BodyTypeType,
  clearBodyType,
  setBodyType,
} from "@/store/features/attributes/bodyType";
import {
  clearEngineCount,
  type EngineCountType,
  setEngineCount,
} from "@/store/features/attributes/engineCount";
import {
  clearHorsePower,
  type HorsePowerType,
  setHorsePower,
} from "@/store/features/attributes/horsepower";
import {
  clearNumOfSeats,
  type NumOfSeatsType,
  setNumOfSeats,
} from "@/store/features/attributes/numOfSeats";
import {
  clearNumOfCylinders,
  type NumOfCylindersType,
  setNumOfCylinders,
} from "@/store/features/attributes/numOfCylinders";
import {
  clearPowerTransSys,
  type PowerTransSysType,
  setPowerTransSys,
} from "@/store/features/attributes/powerTransmissionSystem";
import {
  clearMotoEngine,
  type MotoEngineType,
  setMotoEngine,
} from "@/store/features/attributes/motoEngine";
import {
  clearNumOfTries,
  type NumOfTriesType,
  setNumOfTries,
} from "@/store/features/attributes/numOfTries";
import {
  clearCondition,
  type ConditionType,
  setCondition,
} from "@/store/features/attributes/condition";
import { condition } from "@/constants";
import { setMileage } from "@/store/features/attributes/mileage";
import { setHeight } from "@/store/features/attributes/height";
import { setWeight } from "@/store/features/attributes/weight";
import { setAge } from "@/store/features/attributes/age";
import { clearCity, setCity } from "@/store/features/city";
import { clearCountry, setCountry } from "@/store/features/country";
import { setCarType } from "@/store/features/carType";
import {
  clearServicesSections,
  setServicesSections,
} from "@/store/features/attributes/servicesSections";
import {
  type AutoPartsType,
  clearAutoParts,
  setAutoParts,
} from "@/store/features/attributes/autoParts";
import {
  type AutoPartsCategoriesType,
  clearAutoPartsCategories,
  setAutoPartsCategories,
} from "@/store/features/attributes/autoPartsCategories";
import { setBrandName } from "@/store/features/attributes/brandName";
import {
  clearModelName,
  setModelName,
} from "@/store/features/attributes/modelName";
import {
  clearAllProductsType,
  setAllProductsType,
} from "@/store/features/AllProductsType";

// Update FilterOption type to handle null values
export type FilterOption = {
  id: string;
  name_ar?: string | undefined;
  name_en?: string | undefined;
  name?: string | undefined;
  value?: string | undefined;
} & (
  | BrandType
  | ModelsType
  | ColorType
  | SubSectionsType
  | Partial<ServicesSectionType>
);

interface FilterAccordionItemProps {
  value: AttributesKeyType;
  title: string;
  options?: FilterOption[];
  searchable?: boolean;
  type:
    | "checkbox"
    | "price"
    | "input"
    | "year"
    | "text"
    | "number"
    | "condition";
  inputType?: "mileage" | "length" | "weight" | "age";
  placeholder?: string;
  className?: string;
}

export default function FilterAccordionItem({
  value,
  title,
  options,
  type,
  searchable = false,
  inputType,
  placeholder,
  className,
}: FilterAccordionItemProps) {
  const dispatch = useAppDispatch();
  const { selectedFilters, priceRange, language, brand } = useAppSelector(
    (state) => ({
      selectedFilters: state.filters.selectedFilters,
      priceRange: state.filters.priceRange,
      language: state.Language.language,
      brand: state.Brand,
    })
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !options) return options;
    return options.filter((option) =>
      (option.name_ar || option.name_en || option.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [options, searchable, searchQuery]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentPage(1));
    const value = e.target.value ? Number.parseInt(e.target.value, 10) : null;

    switch (inputType) {
      case "mileage":
        dispatch(setMileage(value));

        break;
      case "length":
        dispatch(setHeight(value));

        break;
      case "weight":
        dispatch(setWeight(value));

        break;
      case "age":
        dispatch(setAge(value));

        break;
    }
  };

  const handletextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentPage(1));
    const inputValue = e.target.value;

    switch (value) {
      case "brand":
        dispatch(setBrandName({ name: inputValue }));
        break;
      case "model":
        dispatch(setModelName({ name: inputValue }));
        break;
    }
  };

  const handleCheckboxChange = (option: FilterOption) => {
    dispatch(setCurrentPage(1));
    dispatch(setSingleFilter({ category: value, option }));

    switch (value) {
      case "countries":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearCountry());
        } else {
          dispatch(setCountry(option as countryType));
        }
        break;
      case "cities":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearCity());
        } else {
          dispatch(setCity(option as cityType));
        }
        break;
      case "allProductsType":
        if (
          selectedFilters[value]?.some(
            (item) => String(item.id) === String(option.id)
          )
        ) {
          dispatch(clearAllProductsType());
        } else {
          dispatch(setAllProductsType(option.value as AllProductsType));
        }
        break;
      case "carType":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(setCarType({ id: 1, key: "car", name: "Cars" }));
        } else {
          dispatch(
            setCarType({
              id: Number(option.id),
              key: "car",
              name: option.name_en || option.name_ar || option.name || "",
            } as CategoryCarsType)
          );
        }
        break;
      case "brand":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearBrand());
        } else {
          dispatch(setBrand(option as BrandType));
          dispatch(clearModel());
          dispatch(clearModelName());
        }
        break;
      case "model":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearModel());
        } else {
          dispatch(
            setModel({ ...(option as ModelsType), brand_id: brand.id || 0 })
          );
        }
        break;
      case "exterior_color":
        if (!selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(
            setColorExterior({
              exterior_color: option as ColorType,
              interior_color: {} as ColorType,
            })
          );
        } else {
          dispatch(clearColorExterior());
        }
        break;
      case "interior_color":
        if (!selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(
            setColorInterior({
              interior_color: option as ColorType,
              exterior_color: {} as ColorType,
            })
          );
        } else {
          dispatch(clearColorInterior());
        }
        break;
      case "car_category":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearSubSections());
        } else {
          dispatch(setSubSections(option as SubSectionsType));
        }
        break;
      case "manufacturing_year":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearYear());
        } else {
          dispatch(setYear(option as YearType));
        }
        break;
      case "regional_specifications":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearSpecific());
        } else {
          dispatch(setSpecific(option as SpecificType));
        }
        break;
      case "fuel_type":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearFuel());
        } else {
          dispatch(setFuel(option as FuelType));
        }
        break;
      case "body_type":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearBodyType());
        } else {
          dispatch(setBodyType(option as BodyTypeType));
        }
        break;
      case "engine_capacity":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearEngineCount());
        } else {
          dispatch(setEngineCount(option as EngineCountType));
        }
        break;
      case "horsepower":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearHorsePower());
        } else {
          dispatch(setHorsePower(option as HorsePowerType));
        }
        break;
      case "number_of_seats":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearNumOfSeats());
        } else {
          dispatch(setNumOfSeats(option as NumOfSeatsType));
        }
        break;
      case "number_of_cylinders":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearNumOfCylinders());
        } else {
          dispatch(setNumOfCylinders(option as NumOfCylindersType));
        }
        break;
      case "power_transmission_system":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearPowerTransSys());
        } else {
          dispatch(setPowerTransSys(option as PowerTransSysType));
        }
        break;
      case "engine_size":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearMotoEngine());
        } else {
          dispatch(setMotoEngine(option as MotoEngineType));
        }
        break;
      case "number_of_tires":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearNumOfTries());
        } else {
          dispatch(setNumOfTries(option as NumOfTriesType));
        }
        break;
      case "service_category":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearServicesSections());
        } else {
          dispatch(setServicesSections(option as ServicesSectionType));
        }
        break;
      case "auto_parts_type":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearAutoParts());
        } else {
          dispatch(setAutoParts(option as AutoPartsType));
        }
        break;
      case "auto_parts_category":
        if (selectedFilters[value]?.some((item) => item.id === option.id)) {
          dispatch(clearAutoPartsCategories());
        } else {
          dispatch(setAutoPartsCategories(option as AutoPartsCategoriesType));
        }
        break;
    }
  };

  const handleConditionChange = (option: ConditionType) => {
    dispatch(setCurrentPage(1));

    // Always clear any existing condition first
    dispatch(clearCondition());

    // If the clicked option is not the currently selected one, set it
    if (!selectedFilters[value]?.some((item) => item.id === option.id)) {
      dispatch(setCondition(option as ConditionType));
      // Update the filter state to show the selected option in the UI
      dispatch(setSingleFilter({ category: value, option }));
    }
  };

  const renderCheckboxOptions = () => (
    <ScrollArea className="h-24 w-full" dir="rtl">
      <div className="flex flex-col gap-3">
        {filteredOptions?.map((option) => (
          <Label key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={option.id}
              checked={selectedFilters[value]?.some(
                (item) => item.id === option.id
              )}
              onCheckedChange={() => handleCheckboxChange(option)}
            />
            <span>
              {(option as SubSectionsType).name ||
                (language === "ar" ? option.name_ar : option.name_en)}
            </span>
          </Label>
        ))}
      </div>
    </ScrollArea>
  );

  const renderInputField = () => (
    <Input
      type={type === "text" ? "text" : "number"}
      placeholder={
        placeholder || (language === "ar" ? "ادخل القيمة" : "Enter value")
      }
      className="text-right h-12"
      value={undefined}
      onChange={type === "text" ? handletextChange : handleNumberChange}
    />
  );

  const renderContent = () => {
    switch (type) {
      case "checkbox":
        return options && options.length > 0 ? (
          renderCheckboxOptions()
        ) : (
          <p className="text-sm text-muted-foreground text-right">
            {language === "ar" ? "لا يوجد عناصر" : "No items available"}
          </p>
        );
      case "number":
      case "text":
        return renderInputField();
      case "price":
        return (
          <PriceRangeSelector
            min={0}
            max={1000000000}
            value={priceRange ?? [0, 1000000000]}
            onRangeChange={(range) => dispatch(setPriceRange(range))}
          />
        );
      case "condition":
        return (
          <ScrollArea className="h-24 w-full" dir="rtl">
            <div className="flex flex-col gap-3">
              {condition.map((option) => (
                <Label key={option.id} className="flex items-center gap-2">
                  <Checkbox
                    id={String(option.id)}
                    checked={selectedFilters.condition?.some(
                      (item) => item.id === String(option.id)
                    )}
                    onCheckedChange={() =>
                      handleConditionChange({
                        ...option,
                        id: String(option.id),
                      })
                    }
                  />
                  <span>
                    {language === "ar" ? option.name_ar : option.name_en}
                  </span>
                </Label>
              ))}
            </div>
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  return (
    <AccordionItem value={value} className={`border-b-2 ${className}`}>
      <AccordionTrigger className="hover:no-underline py-2" dir="rtl">
        <span className="text-base font-semibold">
          {value === "auto_parts_category"
            ? language === "ar"
              ? "القسم"
              : "Category"
            : title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="">
        <div className="space-y-3 py-4 px-2">
          {options &&
            options.length > 5 &&
            searchable &&
            type === "checkbox" && (
              <div className="relative  mx-auto">
                <Search className="absolute right-2 top-[50%] transform translate-y-[-50%] h-4 w-4 text-primary" />
                <Input
                  placeholder={language === "ar" ? "بحث سريع" : "Quick search"}
                  className="pr-8 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                />
              </div>
            )}
          {renderContent()}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
