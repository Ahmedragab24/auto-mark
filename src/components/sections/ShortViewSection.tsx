"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetHomeProductsQuery } from "@/store/apis/products";
import { useEffect, useState } from "react";
import { Cart } from "../Cart";
import type { ProductType } from "@/types";
import SkeletonProduct from "../SkeletonProduct";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setAllProductsType } from "@/store/features/AllProductsType";
import { useRouter } from "next/navigation";
import { setCategories } from "@/store/features/categories";
import TitleSection from "../TitleSection";
import { clearFilters, setSingleFilter } from "@/store/features/filter";
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
import { setCurrentPage } from "@/store/features/currentPage";
import { clearMileage } from "@/store/features/attributes/mileage";
import { clearAge } from "@/store/features/attributes/age";
import { clearHeight } from "@/store/features/attributes/height";
import { clearWeight } from "@/store/features/attributes/weight";
import { clearCity } from "@/store/features/city";
import { clearServicesSections } from "@/store/features/attributes/servicesSections";
import { clearAutoPartsCategories } from "@/store/features/attributes/autoPartsCategories";
import { resetSorting } from "@/store/features/sortingData";
import { clearBrandName } from "@/store/features/attributes/brandName";
import { clearModelName } from "@/store/features/attributes/modelName";
import { setCountry } from "@/store/features/country";

interface IProps {
  Content:
    | "Special"
    | "new"
    | "mostView"
    | "scrap"
    | "services"
    | "SpareParts"
    | "carsNumbers"
    | "bikes"
    | "trucks"
    | "boots";
}

const ShortViewSection = ({ Content }: IProps) => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { Country } = useAppSelector((state: RootState) => state.Country);
  const { data, isLoading, isError } = useGetHomeProductsQuery({
    lang: language,
    countryId: Country.id,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [sectionTitle, setSectionTitle] = useState<{ ar: string; en: string }>({
    ar: "",
    en: "",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isError || !data?.data) return;

    switch (Content) {
      case "Special":
        setProducts(data.data.premuim_Products || []);
        setSectionTitle({ ar: "السيارات المميزة", en: "Special Cars" });
        break;
      case "new":
        setProducts(data.data.newProducts || []);
        setSectionTitle({ ar: "الأحدث في السيارات", en: "Newest Cars" });
        break;
      case "mostView":
        setProducts(data.data.productsMostView || []);
        setSectionTitle({ ar: "السيارات المختارة", en: "Most Viewed Cars" });
        break;
      case "scrap":
        setProducts(
          data.data.categories_with_products_tow?.[0]?.products || []
        );
        setSectionTitle({ ar: "سيارات سكراب وحوادث", en: "Scrap & Accidents" });
        break;
      case "services":
        setProducts(
          data.data.categories_with_products_tow?.[1]?.products || []
        );
        setSectionTitle({ ar: "الخدمات", en: "Services" });
        break;
      case "SpareParts":
        setProducts(
          data.data.categories_with_products_tow?.[2]?.products || []
        );
        setSectionTitle({ ar: "قطع غيار", en: "Spare Parts" });
        break;
      case "carsNumbers":
        setProducts(
          data.data.categories_with_products_tow?.[3]?.products || []
        );
        setSectionTitle({ ar: "أرقام السيارات", en: "Car Numbers" });
        break;
      case "bikes":
        setProducts(
          data.data.categories_with_products_tow?.[4]?.products || []
        );
        setSectionTitle({ ar: "دراجات", en: "Bikes" });
        break;
      case "trucks":
        setProducts(
          data.data.categories_with_products_tow?.[5]?.products || []
        );
        setSectionTitle({ ar: "شاحنات", en: "Trucks" });
        break;
      case "boots":
        setProducts(
          data.data.categories_with_products_tow?.[6]?.products || []
        );
        setSectionTitle({ ar: "قوارب", en: "Boats" });
        break;
      default:
        setProducts([]);
        setSectionTitle({ ar: "", en: "" });
    }
  }, [Content, data, isLoading, isError]);

  const handlerMoreProducts = () => {
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
    dispatch(clearServicesSections());
    dispatch(clearAutoPartsCategories());
    dispatch(resetSorting());
    dispatch(clearBrandName());
    dispatch(clearModelName());
    dispatch(
      setCountry({
        id: 1,
        name_ar: "الإمارات العربية المتحدة",
        name_en: "UAE",
      })
    );
    switch (Content) {
      case "Special":
        dispatch(setAllProductsType("premium"));
        dispatch(
          setSingleFilter({
            category: "allProductsType",
            option: {
              id: "2",
              name_ar: "المميز",
              name_en: "Featured",
              value: "premium",
            },
          })
        );
        dispatch(
          setCategories({
            id: 1,
            key: "car",
            name: "Cars",
          })
        );
        router.push("/categories/car");
        break;
      case "new":
        dispatch(setAllProductsType("new"));
        dispatch(
          setSingleFilter({
            category: "allProductsType",
            option: {
              id: "3",
              name_ar: "الجديد",
              name_en: "new",
              value: "new",
            },
          })
        );
        dispatch(
          setCategories({
            id: 1,
            key: "car",
            name: "Cars",
          })
        );
        router.push("/categories/car");
        break;
      case "mostView":
        dispatch(setAllProductsType("mostViewed"));
        dispatch(
          setSingleFilter({
            category: "allProductsType",
            option: {
              id: "4",
              name_ar: "الشائع",
              name_en: "Common",
              value: "mostViewed",
            },
          })
        );

        dispatch(
          setCategories({
            id: 1,
            key: "car",
            name: "Cars",
          })
        );
        router.push("/categories/car");
        break;
      case "scrap":
        dispatch(setAllProductsType("category"));
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 8,
            key: "scrap",
            name: "Scrap Cars & Accidents",
          })
        );
        router.push("/categories/scrap");
        break;
      case "services":
        dispatch(setAllProductsType("category"));
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 7,
            key: "services",
            name: "Services",
          })
        );
        router.push("/categories/services");
        break;
      case "SpareParts":
        dispatch(setAllProductsType("category"));
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 5,
            key: "spare_parts",
            name: "spare parts",
          })
        );
        router.push("/categories/spare_parts");
        break;
      case "carsNumbers":
        dispatch(setAllProductsType("category"));
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 6,
            key: "car_numbers",
            name: "Car numbers",
          })
        );
        router.push("/categories/car_numbers");
        break;
      case "bikes":
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 2,
            key: "car",
            name: "motorcycles",
          })
        );
        router.push("/categories/car");
        break;
      case "trucks":
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 3,
            key: "car",
            name: "Trucks",
          })
        );
        router.push("/categories/car");
        break;
      case "boots":
        setSingleFilter({
          category: "allProductsType",
          option: {
            id: "1",
            name_ar: "الكل",
            name_en: "All",
            value: "category",
          },
        });
        dispatch(
          setCategories({
            id: 4,
            key: "car",
            name: "Boats",
          })
        );
        router.push("/categories/car");
        break;
      default:
        router.push("/categories/car");
    }
  };

  return (
    <section className="section">
      {products.length === 0 ? (
        <></>
      ) : (
        <div>
          {isLoading && <SkeletonProduct count={4} />}

          {isError && (
            <p className="text-center text-red-500">
              {language === "en" ? "Something went wrong" : "حدث خطأ ما"}
            </p>
          )}

          {!isLoading && !isError && data?.data && (
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center justify-between"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <TitleSection
                  title_en={sectionTitle.en}
                  title_ar={sectionTitle.ar}
                />

                {products.length > 3 && (
                  <div
                    onClick={handlerMoreProducts}
                    className="flex items-center gap-2 text-sm text-gray-500 duration-300 cursor-pointer md:text-bodyL hover:text-foreground group"
                  >
                    {language === "en" ? "Show more" : "المزيد"}
                    {language === "en" ? (
                      <ChevronRight
                        size={20}
                        className="duration-300 group-hover:translate-x-[5px]"
                      />
                    ) : (
                      <ChevronLeft
                        size={20}
                        className="duration-300 group-hover:translate-x-[-5px]"
                      />
                    )}
                  </div>
                )}
              </div>

              <div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {products.slice(0, 4).map((product) => (
                  <Cart key={product.id} product={product} lang={language} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ShortViewSection;
