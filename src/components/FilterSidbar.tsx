"use client";

import { Accordion } from "@/components/ui/accordion";
import FilterAccordionItem from "./FilterAccordionItem";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type {
  CategoriesKeyType,
  CategoryCarsType,
  cityType,
  countryType,
} from "@/types";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearFilters } from "@/store/features/filter";
import { clearBrand } from "@/store/features/attributes/brand";
import { useFilterData } from "@/hooks/use-filterData";
import { SelectedFilters } from "./SelectedFilter";
import {
  AllProductsTypes,
  bikeEngineSize,
  cylindersCount,
  enginCount,
  fuelNameType,
  horsePower,
  NumberOfTiresOfBicks,
  numOfSeatsName,
  PowerTransmissionSystemType,
  specificationsType,
  structureType,
  SubSectionsServicesType,
  year,
} from "@/constants";
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
import { setCurrentPage } from "@/store/features/currentPage";
import { clearMileage } from "@/store/features/attributes/mileage";
import { clearAge } from "@/store/features/attributes/age";
import { clearHeight } from "@/store/features/attributes/height";
import { clearWeight } from "@/store/features/attributes/weight";
import { useCitiesData } from "@/hooks/use-citiesData";
import { clearCity } from "@/store/features/city";
import { useCountriesData } from "@/hooks/use-countriesData";
import { setCountry } from "@/store/features/country";
import { clearAllProductsType } from "@/store/features/AllProductsType";
import { useEffect, useState } from "react";
import { useCategoriesData } from "@/hooks/use-categoriesData";
import { setCarType } from "@/store/features/carType";
import { resetSorting } from "@/store/features/sortingData";
import { clearServicesSections } from "@/store/features/attributes/servicesSections";
import { clearAutoPartsCategories } from "@/store/features/attributes/autoPartsCategories";
import { clearBrandName } from "@/store/features/attributes/brandName";
import { clearModelName } from "@/store/features/attributes/modelName";

interface IProps {
  typeCategory: CategoriesKeyType;
}

export default function FilterSidebar({ typeCategory }: IProps) {
  const dispatch = useAppDispatch();
  const { productsNumber, language } = useAppSelector((state) => ({
    productsNumber: state.productsNumber.productsNumber,
    language: state.Language.language,
  }));
  const CountryList = useCountriesData();
  const CityList = useCitiesData();
  const CarCategoryType = useCategoriesData();
  const [IsClient, setIsClient] = useState(false);

  const {
    filters,
    brands,
    models,
    // SuSections,
    InteriorColors,
    AutoParts,
    AutoPartsCategory,
  } = useFilterData();

  console.log("Filters:", filters);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform SubSectionsServicesType to be compatible with FilterOption type
  const transformedSubSections = SubSectionsServicesType.map((item) => ({
    ...item,
    id: item.id?.toString() || "0",
    name_ar: item.name_ar || undefined,
    name_en: item.name_en || undefined,
    value: item.value || undefined,
  }));

  const ClearAllFilters = () => {
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
        name_en: "UAE",
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
  };

  if (!IsClient) return null;

  return (
    <div
      className="w-full md:w-fit px-2 md:min-h-screen flex flex-col gap-4 md:gap-4 items-center mb-2 md:mb-10"
      dir="rtl"
    >
      <div className="flex flex-col gap-4 md:pb-2 md:border-b-2 w-full">
        <div className="flex items-center justify-between font-regular">
          <h3 className="text-bodyL">
            {typeCategory === "showroom" ? (
              <>
                {language === "ar" ? "المعارض" : "Showrooms"}({productsNumber})
              </>
            ) : (
              <>
                {language === "ar" ? "المنتجات" : "Products"}({productsNumber})
              </>
            )}
          </h3>
          <Button
            className="text-bodyS text-primary"
            variant="link"
            onClick={() => ClearAllFilters()}
          >
            {language === "ar" ? "مسح الفلتر" : "Clear Filter"}
          </Button>
        </div>
        <SelectedFilters />
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md px-4">
        <Accordion
          className="flex flex-row justify-center md:flex-col gap-4"
          type="multiple"
        >
          <FilterAccordionItem
            type="checkbox"
            className="border-b"
            value="countries"
            options={CountryList.Countries?.map((country: countryType) => ({
              ...country,
              id: country.id?.toString() || "",
            }))}
            title={language === "ar" ? "الدولة" : "Country"}
          />

          <FilterAccordionItem
            type="checkbox"
            className="border-b"
            value="cities"
            options={CityList.Cities?.map((city: cityType) => ({
              ...city,
              id: city.id?.toString() || "",
            }))}
            title={language === "ar" ? "المدينة" : "City"}
          />

          <FilterAccordionItem
            type="checkbox"
            className="border-b"
            value="allProductsType"
            options={AllProductsTypes.map((c) => ({
              ...c,
              id: c.id?.toString() || "",
            }))}
            title={language === "ar" ? "نوع المنتجات" : "Product Type"}
          />

          <>
            {filters
              .filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (filter: any) => {
                  // Always filter out car_category
                  if (filter.key === "car_category") return false;
                  if (filter.key === "brand" && filter.category_id === 3)
                    return false;
                  if (filter.key === "model" && filter.category_id === 4)
                    return false;

                  // Only show service_category when typeCategory is services
                  if (filter.key === "service_category") {
                    return typeCategory === "services";
                  }

                  // Show all other filters
                  return true;
                }
              )
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((filter: any) => (
                <FilterAccordionItem
                  key={filter.id}
                  inputType={
                    filter.key === "mileage"
                      ? "mileage"
                      : filter.key === "length"
                      ? "length"
                      : filter.key === "weight"
                      ? "weight"
                      : filter.key === "age"
                      ? "age"
                      : "mileage"
                  }
                  type={
                    filter.key === "mileage" ||
                    filter.key === "length" ||
                    filter.key === "weight" ||
                    filter.key === "age"
                      ? "number"
                      : "checkbox"
                  }
                  value={filter.key}
                  title={language === "ar" ? filter.title_ar : filter.title_en}
                  searchable
                  placeholder={
                    filter.input_type === 1
                      ? "ادخل القيمة"
                      : filter.input_type === 4
                      ? "ادخل السعر من - الي"
                      : filter.category_id === 3 || filter.category_id === 4
                      ? "ادخل النوع"
                      : ""
                  }
                  options={
                    filter.key === "brand"
                      ? brands
                      : filter.key === "model"
                      ? models
                      : filter.key === "exterior_color"
                      ? InteriorColors
                      : filter.key === "interior_color"
                      ? InteriorColors
                      : filter.key === "auto_parts_type"
                      ? AutoParts
                      : filter.key === "auto_parts_category"
                      ? AutoPartsCategory
                      : filter.key === "manufacturing_year"
                      ? year
                      : filter.key === "body_type"
                      ? structureType
                      : filter.key === "engine_capacity"
                      ? enginCount
                      : filter.key === "fuel_type"
                      ? fuelNameType
                      : filter.key === "horsepower"
                      ? horsePower
                      : filter.key === "number_of_cylinders"
                      ? cylindersCount
                      : filter.key === "number_of_seats"
                      ? numOfSeatsName
                      : filter.key === "regional_specifications"
                      ? specificationsType
                      : filter.key === "engine_size"
                      ? bikeEngineSize
                      : filter.key === "power_transmission_system"
                      ? PowerTransmissionSystemType
                      : filter.key === "number_of_tires"
                      ? NumberOfTiresOfBicks
                      : []
                  }
                />
              ))}
          </>

          {typeCategory === "car" && (
            <FilterAccordionItem
              type="condition"
              className="border-b"
              value="condition"
              title={language === "ar" ? "الحالة" : "Condition"}
            />
          )}

          {typeCategory === "services" && (
            <FilterAccordionItem
              type="checkbox"
              className="border-b"
              value="service_category"
              title={language === "ar" ? "القسم" : "Section"}
              options={transformedSubSections}
            />
          )}

          {typeCategory !== "showroom" && (
            <FilterAccordionItem
              type="price"
              className="border-b-0"
              value="price"
              title={language === "ar" ? "السعر" : "Price"}
            />
          )}

          {typeCategory === "showroom" && (
            <FilterAccordionItem
              type="checkbox"
              className="border-b"
              value="carType"
              options={CarCategoryType.Category?.map(
                (category: CategoryCarsType) => ({
                  ...category,
                  id: category.id?.toString() || "",
                })
              )}
              title={language === "ar" ? "التخصص" : "Specialty"}
            />
          )}
        </Accordion>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
