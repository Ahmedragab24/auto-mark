"use client";

import React, { useEffect } from "react";
import ProductsGrid from "@/components/ProductsGrid";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  useGetShowroomFollowersQuery,
  useGetShowroomProductsByIdQuery,
} from "@/store/apis/showrooms";
import { ProductType, ShowroomByIdType, ShowroomFlowersType } from "@/types";
import Image from "next/image";
import FollowingShowroomBtn from "@/components/exhibitions/FollowingShowroomBtn";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import SendMessageBtn from "@/components/SendMassageBtn";
import { TapsCategories } from "@/constants";

const ExhibitionsPage = () => {
  const params = useParams();
  const showroomID = params?.showroomID as string;
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data, isLoading, isError } = useGetShowroomProductsByIdQuery({
    id: Number(showroomID),
    lang: language,
  });
  const { data: DataFollowers } = useGetShowroomFollowersQuery(
    Number(showroomID)
  );

  const showroom: ShowroomByIdType = data?.data?.showrooms;
  const DataFollowersList: ShowroomFlowersType = DataFollowers?.data;

  console.log(showroom);

  const [tabsCategory, setTabsCategory] = React.useState<
    number | string | undefined
  >(1);

  useEffect(() => {
    setTabsCategory(showroom?.category_id || 1);
  }, [showroom?.category_id]);

  return (
    <main>
      <section className="h-auto lg:h-[80vh] mt-32">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${showroom?.setting?.background_image}`}
          alt="Image Cover"
          width={1400}
          height={700}
          className="h-full w-full !aspect-video object-cover"
        />
      </section>
      <section className="container flex flex-col gap-4 lg:flex-row max-auto pb-10 px-4">
        <div
          className="flex flex-col bg-background border h-fit p-6 rounded-2xl shadow-md gap-10 lg:-mt-[12rem] lg:w-[450px]"
          dir="rtl"
        >
          <div className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${showroom?.setting?.logo}`}
              alt="Image Cover"
              width={400}
              height={500}
              className="h-[200px] rounded-xl w-full"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {language === "en"
                ? showroom?.setting?.showroom_en
                : showroom?.setting?.showroom_ar}
            </h2>
            <p className="text-md break-words font-regular max-w-[300px]">
              {showroom?.info}
            </p>
          </div>

          <div
            className="flex flex-col gap-4 items-start"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex border-b border-border justify-center w-full gap-10 pb-2">
              <h2>{language === "en" ? "Ads" : "الاعلانات"} :</h2>
              <h2>
                {data?.data?.numberOfProducts}{" "}
                {language === "en" ? "Ads" : "إعلان"}
              </h2>
            </div>
            <div className="flex border-b border-border justify-center w-full gap-10 pb-2">
              <h2>{language === "en" ? "Followers" : "المتابعين"} :</h2>
              <h2>
                {data?.data?.numberOfFollowers}{" "}
                {language === "en" ? "Follower" : "متابع"}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FollowingShowroomBtn
              ShowroomID={showroom?.id}
              DataFollowersList={DataFollowersList}
            />
            <SendMessageBtn showroom={showroom} />
          </div>
        </div>

        {/* <FilterSidebar typeCategory="showroomInfo" /> */}

        <div className="flex flex-col w-full gap-8">
          <div className="border-b border-border w-full pt-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {!showroom?.category_id
                ? TapsCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={"GradientLink"}
                      onClick={() => setTabsCategory(category.id)}
                      className={`${
                        tabsCategory === category.id
                          ? "bg-custom-gradient text-primary border-b-2 border-primary  duration-300"
                          : ""
                      }`}
                    >
                      {language === "ar" ? category.name_ar : category.name_en}
                    </Button>
                  ))
                : (() => {
                    const category = TapsCategories.find(
                      (category) => category.id === showroom?.category_id
                    );
                    return category ? (
                      <Button
                        variant={"GradientLink"}
                        className={`${
                          tabsCategory === category.id
                            ? "bg-custom-gradient text-primary border-b-2 border-primary  duration-300"
                            : ""
                        }`}
                      >
                        {language === "ar"
                          ? category.name_ar
                          : category.name_en}
                      </Button>
                    ) : null;
                  })()}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <ProductsGrid
              products={data?.data?.showrooms?.products.filter(
                (product: ProductType) => product.category_id === tabsCategory
              )}
              isError={isError}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExhibitionsPage;
