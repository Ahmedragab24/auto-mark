"use client";

import { useEffect, useState, useMemo } from "react";
import ProductsGrid from "@/components/ProductsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductType } from "@/types";
import { useGetFavoritesQuery } from "@/store/apis/favorite";
import { useRouter } from "next/navigation";
import { getUserData } from "@/utils/userToken";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Breadcrumbs } from "@/components/Breadcrumbs ";

const translations = {
  ar: {
    all: "الكل",
    vehicles: "المركبات",
    exhibitions: "المعارض",
    noFavorites: "لا يوجد منتجات في المفضلة",
    noVehicles: "لا يوجد مركبات في المفضلة",
    noExhibitions: "لا يوجد معارض في المفضلة",
    loginRequired: "يرجى تسجيل الدخول",
    loginMessage: "يرجى تسجيل الدخول للوصول لهذه الصفحة",
  },
  en: {
    all: "All",
    vehicles: "Vehicles",
    exhibitions: "Exhibitions",
    noFavorites: "No favorite products",
    noVehicles: "No favorite vehicles",
    noExhibitions: "No favorite exhibitions",
    loginRequired: "Please log in",
    loginMessage: "Please log in to access this page",
  },
};

const FavoritesPage = () => {
  const [dataState, setDataState] = useState<ProductType[]>([]);
  const { data } = useGetFavoritesQuery("");
  const router = useRouter();
  const user = getUserData();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [IsClient, setIsClient] = useState(false);

  const t = translations[language || "ar"];
  const isRTL = language === "ar";

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  useEffect(() => {
    if (!user) {
      toast({
        title: t.loginRequired,
        description: t.loginMessage,
        variant: "destructive",
      });
      router.push("/");
    }
  }, [user, router, t]);

  const favoritesList = useMemo(() => data?.data?.products || [], [data]);

  // Create a reversed copy of the data without mutating the original
  const reversedData = useMemo(() => [...dataState].reverse(), [dataState]);

  // Filter the reversed data for vehicles
  const Vehicles = useMemo(
    () =>
      reversedData.filter(
        (item) => item.category_id && [1, 2, 3, 4].includes(item.category_id)
      ),
    [reversedData]
  );

  // Filter the reversed data for exhibitions
  const Exhibitions = useMemo(
    () =>
      reversedData.filter(
        (item) => item.category_id && [9].includes(item.category_id)
      ),
    [reversedData]
  );

  useEffect(() => {
    setDataState(favoritesList);
  }, [favoritesList]);

  if (!user) return null;
  if (!IsClient) return null;

  return (
    <div className="container px-4 py-10 mx-auto mt-36">
      <Breadcrumbs />

      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <Tabs defaultValue="All" className="w-full">
          <TabsList
            className="flex flex-col items-center justify-center w-full gap-4 p-20 mx-auto md:p-8 md:flex-row md:w-fit rounded-2xl mb-10"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <TabsTrigger
              value="All"
              className="w-1/2 data-[state=active]:bg-primary rounded-lg data-[state=active]:text-white px-16"
            >
              {t.all}
            </TabsTrigger>
            <TabsTrigger
              value="Vehicles"
              className="w-1/2 data-[state=active]:bg-primary rounded-lg data-[state=active]:text-white px-16"
            >
              {t.vehicles}
            </TabsTrigger>
            <TabsTrigger
              value="Exhibitions"
              className="w-1/2 data-[state=active]:bg-primary rounded-lg data-[state=active]:text-white px-16"
            >
              {t.exhibitions}
            </TabsTrigger>
          </TabsList>

          {/* تبويب الكل */}
          <TabsContent value="All">
            {dataState.length > 0 ? (
              <ProductsGrid
                products={reversedData}
                className="lg:!grid-cols-4 "
              />
            ) : (
              <div className="h-[55vh] flex items-center justify-center text-center">
                <p className="text-2xl">{t.noFavorites}</p>
              </div>
            )}
          </TabsContent>

          {/* تبويب المركبات */}
          <TabsContent value="Vehicles">
            {Vehicles.length > 0 ? (
              <ProductsGrid products={Vehicles} className="lg:!grid-cols-4 " />
            ) : (
              <div className="h-[55vh] flex items-center justify-center text-center">
                <p className="text-2xl">{t.noVehicles}</p>
              </div>
            )}
          </TabsContent>

          {/* تبويب المعارض */}
          <TabsContent value="Exhibitions">
            {Exhibitions.length > 0 ? (
              <ProductsGrid
                products={Exhibitions}
                className="lg:!grid-cols-4 "
              />
            ) : (
              <div className="h-[55vh] flex items-center justify-center text-center">
                <p className="text-2xl">{t.noExhibitions}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FavoritesPage;
