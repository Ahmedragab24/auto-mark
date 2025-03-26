import { XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPriceRange, setText, toggleFilter } from "@/store/features/filter";
import { clearBrand } from "@/store/features/attributes/brand";
import { clearModel } from "@/store/features/attributes/model";
import { clearYear } from "@/store/features/attributes/year";
import { clearSubSections } from "@/store/features/attributes/subSections";
import { clearAutoParts } from "@/store/features/attributes/autoParts";
import { clearBodyType } from "@/store/features/attributes/bodyType";
import { clearEngineCount } from "@/store/features/attributes/engineCount";
import {
  clearColorExterior,
  clearColorInterior,
} from "@/store/features/attributes/colors";
import { clearFuel } from "@/store/features/attributes/fuelType";
import { clearHorsePower } from "@/store/features/attributes/horsepower";
import { clearNumOfCylinders } from "@/store/features/attributes/numOfCylinders";
import { clearNumOfSeats } from "@/store/features/attributes/numOfSeats";
import { clearMileage } from "@/store/features/attributes/mileage";
import { clearAge } from "@/store/features/attributes/age";
import { clearHeight } from "@/store/features/attributes/height";
import { clearWeight } from "@/store/features/attributes/weight";
import { clearCity } from "@/store/features/city";
import { setCountry } from "@/store/features/country";
import { clearNumOfTries } from "@/store/features/attributes/numOfTries";
import { clearPowerTransSys } from "@/store/features/attributes/powerTransmissionSystem";
import { clearMotoEngine } from "@/store/features/attributes/motoEngine";
import { clearSpecific } from "@/store/features/attributes/specifications";
import { clearCondition } from "@/store/features/attributes/condition";
import { setCarType } from "@/store/features/carType";
import { sortOptions } from "@/constants";
import { resetSorting } from "@/store/features/sortingData";
import { clearServicesSections } from "@/store/features/attributes/servicesSections";
import { clearAutoPartsCategories } from "@/store/features/attributes/autoPartsCategories";
import { clearAllProductsType } from "@/store/features/AllProductsType";

export function SelectedFilters() {
  const dispatch = useAppDispatch();
  const {
    selectedFilters,
    priceRange,
    language,
    text,
    number,
    autoParts,
    mileage,
    age,
    height,
    weight,
    sorting,
  } = useAppSelector((state) => ({
    selectedFilters: state.filters.selectedFilters,
    priceRange: state.filters.priceRange,
    country: state.Country.Country,
    city: state.City.City,
    text: state.filters.text,
    number: state.filters.number,
    year: state.Year,
    language: state.Language.language,
    brand: state.Brand,
    model: state.Model,
    subSections: state.SubSections,
    autoParts: state.AutoParts,
    condition: state.Condition,
    bodyType: state.BodyType,
    specific: state.Specific,
    engineCount: state.EngineCount,
    interiorColor: state.Colors.interior_color,
    exteriorColor: state.Colors.exterior_color,
    fuelType: state.FuelType,
    powerHours: state.HorsePower,
    numOfCylinders: state.NumOfCylinders,
    numOfSeats: state.NumOfSeats,
    numOfTires: state.NumOfTries,
    powerTransSysType: state.PowerTransSysType,
    engineSize: state.MotoEngineType,
    mileage: state.Mileage,
    age: state.Age,
    height: state.Height,
    weight: state.Weight,
    sorting: state.Sorting.sort_by,
    allProductsType: state.AllProductsType.allProductsType,
  }));

  return (
    <div
      className="grid grid-cols-1 gap-2"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {Object.entries(selectedFilters).map(([category, filters]) =>
        filters.map((filter) => (
          <span
            key={`${category}-${filter.id}`}
            className="relative w-fit px-5 py-1 rounded-md text-bodyS bg-secondary text-foreground flex"
          >
            {category === "countries"
              ? language === "ar"
                ? "الدولة :"
                : "Country :"
              : null}

            {category === "cities"
              ? language === "ar"
                ? "المدينة :"
                : "City :"
              : null}

            {category === "carType"
              ? language === "ar"
                ? "التخصص :"
                : "specialization :"
              : null}

            {category === "body_type"
              ? language === "ar"
                ? "نوع الهيكل :"
                : "Body Type :"
              : null}

            {category === "brand"
              ? language === "ar"
                ? "الماركة :"
                : "Brand :"
              : null}

            {category === "car_category"
              ? language === "ar"
                ? "الفئة :"
                : "Car Category :"
              : null}

            {category === "engine_capacity"
              ? language === "ar"
                ? "سعة المحرك :"
                : "Engine Capacity :"
              : null}

            {category === "exterior_color"
              ? language === "ar"
                ? "اللون الخارجي :"
                : "Exterior Color :"
              : null}

            {category === "interior_color"
              ? language === "ar"
                ? "اللون الداخلي :"
                : "Interior Color :"
              : null}

            {category === "fuel_type"
              ? language === "ar"
                ? "نوع الوقود :"
                : "Fuel Type :"
              : null}

            {category === "horsepower"
              ? language === "ar"
                ? "قوة الحصان :"
                : "Horsepower :"
              : null}

            {category === "manufacturing_year"
              ? language === "ar"
                ? "سنة الصنع :"
                : "Manufacturing Year :"
              : null}

            {category === "regional_specifications"
              ? language === "ar"
                ? "المواصفات :"
                : "Specifications :"
              : null}

            {category === "model"
              ? language === "ar"
                ? "الموديل :"
                : "Model :"
              : null}

            {category === "number_of_cylinders"
              ? language === "ar"
                ? "عدد الاسطوانات :"
                : "Number of Cylinders :"
              : null}

            {category === "number_of_seats"
              ? language === "ar"
                ? "عدد المقاعد :"
                : "Number of Seats :"
              : null}

            {category === "engine_size"
              ? language === "ar"
                ? "حجم المحرك :"
                : "Engine Size :"
              : null}

            {category === "number_of_tires"
              ? language === "ar"
                ? "عدد الإطارات :"
                : "Number of Tires :"
              : null}

            {category === "power_transmission_system"
              ? language === "ar"
                ? "نظام نقل القدرة :"
                : "Power Transmission System :"
              : null}

            {category === "condition"
              ? language === "ar"
                ? "الحالة :"
                : "Condition :"
              : null}

            {category === "allProductsType"
              ? language === "ar"
                ? "نوع المنتجات :"
                : "Products Type :"
              : null}

            {filter.name || filter.name_ar
              ? language === "ar"
                ? filter.name_ar ?? filter.name
                : filter.name_en ?? filter.name
              : filter.name}

            <XCircle
              className="absolute w-3 h-3 cursor-pointer top-1 right-1"
              onClick={() => {
                dispatch(toggleFilter({ category, option: filter }));
                if (category === "cities") dispatch(clearCity());
                if (category === "allProductsType")
                  dispatch(clearAllProductsType());
                if (category === "countries")
                  dispatch(
                    setCountry({
                      id: 1,
                      name_ar: "الإمارات العربية المتحدة",
                      name_en: "UAE",
                    })
                  );
                if (category === "brand") dispatch(clearBrand());
                if (category === "model") dispatch(clearModel());
                if (category === "manufacturing_year") dispatch(clearYear());
                if (category === "car_category") dispatch(clearSubSections());
                if (autoParts.id) dispatch(clearAutoParts());
                if (category === "body_type") dispatch(clearBodyType());
                if (category === "engine_capacity")
                  dispatch(clearEngineCount());
                if (category === "interior_color")
                  dispatch(clearColorInterior());
                if (category === "exterior_color")
                  dispatch(clearColorExterior());
                if (category === "fuel_type") dispatch(clearFuel());
                if (category === "horsepower") dispatch(clearHorsePower());
                if (category === "number_of_cylinders")
                  dispatch(clearNumOfCylinders());
                if (category === "number_of_seats") dispatch(clearNumOfSeats());
                if (category === "number_of_tires") dispatch(clearNumOfTries());
                if (category === "power_transmission_system")
                  dispatch(clearPowerTransSys());
                if (category === "engine_size") dispatch(clearMotoEngine());
                if (category === "regional_specifications")
                  dispatch(clearSpecific());
                if (category === "age") dispatch(clearAge());
                if (category === "condition") dispatch(clearCondition());
                if (category === "auto_parts_type") dispatch(clearAutoParts());
                if (category === "service_category")
                  dispatch(clearServicesSections());
                dispatch(clearAutoPartsCategories());
                if (category === "carType")
                  dispatch(
                    setCarType({
                      id: 1,
                      key: "car",
                      name: "Cars",
                    })
                  );
              }}
            />
          </span>
        ))
      )}

      {sorting && (
        <span className="relative w-fit px-5 py-1 rounded-md text-bodyS bg-secondary text-foreground">
          {language === "ar" ? "الترتيب: " : "Sort By: "}
          {
            sortOptions[language].find((option) => option.value === sorting)
              ?.label
          }
          <XCircle
            className="absolute w-3 h-3 cursor-pointer top-1 right-1"
            onClick={() => dispatch(resetSorting())}
          />
        </span>
      )}

      {((priceRange?.[0] ?? 0) !== 0 ||
        (priceRange?.[1] ?? 1000000000) !== 1000000000) && (
        <span className="w-fit relative px-5 py-1 rounded-md text-bodyS bg-secondary text-foreground">
          {language === "ar" ? "السعر" : "Price"}: {priceRange?.[0]} -{" "}
          {priceRange?.[1]}
          <XCircle
            className="absolute w-3 h-3 cursor-pointer top-1 right-1"
            onClick={() => dispatch(setPriceRange([0, 1000000000]))}
          />
        </span>
      )}

      {(text ||
        number ||
        mileage?.number ||
        age?.number ||
        height?.number ||
        weight?.number) && (
        <div
          className={`relative  text-foreground ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {text && <>{text}</>}
          {number && (
            <span className="w-fit px-5 py-1 rounded-md text-bodyS bg-secondary">
              {language === "ar" ? "العدد" : "Number"}: {number}
            </span>
          )}
          {mileage?.number && (
            <div
              className={`flex flex-col gap-1 mb-1 w-fit px-5 py-1 rounded-md text-bodyS bg-secondary ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {language === "ar" ? "المسافة" : "Mileage"}: {mileage.number}
              {language === "ar" ? "كم" : "KM"}
            </div>
          )}
          {age?.number && (
            <div className="flex flex-col gap-1 mb-1 w-fit px-5 py-1 rounded-md text-bodyS bg-secondary">
              {language === "ar" ? "العمر" : "Age"}: {age.number}
              {language === "ar" ? "عام" : "Years"}
            </div>
          )}
          {weight?.number && (
            <div className="flex flex-col gap-1 mb-1 w-fit px-5 py-1 rounded-md text-bodyS bg-secondary">
              {language === "ar" ? "الوزن" : "Weight"}: {weight.number}
              {language === "ar" ? "كيلوجرام" : "KG"}
            </div>
          )}
          {height?.number && (
            <div className="flex flex-col gap-1 mb-1 w-fit px-5 py-1 rounded-md text-bodyS bg-secondary">
              {language === "ar" ? "الارتفاع" : "Height"}: {height.number}
              {language === "ar" ? "سانتيمتر" : "CM"}
            </div>
          )}
          <XCircle
            className="absolute w-3 h-3 cursor-pointer top-1 right-1"
            onClick={() => {
              if (text) dispatch(setText(""));
              if (mileage?.number) dispatch(clearMileage());
              if (age?.number) dispatch(clearAge());
              if (height?.number) dispatch(clearHeight());
              if (weight?.number) dispatch(clearWeight());
            }}
          />
        </div>
      )}
    </div>
  );
}
