"use client";

import DialogUpdateShowroom from "@/components/DialogUpdateShowroom";
import LoaderSpan from "@/components/LoaderSpan";
import ProductsGrid from "@/components/ProductsGrid";
import { Button } from "@/components/ui/button";
import { TapsCategories } from "@/constants";
import { toast } from "@/hooks/use-toast";
import {
  useGetShowroomProductsByIdQuery,
  useLazyVerificationRequestQuery,
} from "@/store/apis/showrooms";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { ErrorType, ProductType, ShowroomType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ExhibitionsPage = () => {
  const {
    UserData: { user, token },
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const { data, isLoading, isError } = useGetShowroomProductsByIdQuery(
    {
      id: user?.id || 0,
      lang: language,
    },
    {
      pollingInterval: 1000,
    }
  );
  const [VerificationRequest] = useLazyVerificationRequestQuery();
  const [OpenDialog, setOpenDialog] = React.useState<boolean>(false);
  const [IsClient, setIsClient] = React.useState<boolean>(false);
  const router = useRouter();

  const showroom = data?.data || [];
  const showroomDetails: ShowroomType = data?.data?.showrooms || [];
  const products: ProductType[] = data?.data?.showrooms?.products || [];
  const [tabsCategory, setTabsCategory] = React.useState<
    number | string | undefined
  >(1);

  useEffect(() => {
    setTabsCategory(showroom?.category_id || 1);
  }, [showroom?.category_id]);

  useEffect(() => {
    setIsClient(true);
    if (!user || !token) {
      toast({
        title: language === "en" ? "Please log in" : "يرجى تسجيل الدخول",
        description:
          language === "en"
            ? "Please log in to access this page"
            : "يرجى تسجيل الدخول للوصول لهذه الصفحة",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [user, token, router, language]);

  const handlerVerificationRequest = async () => {
    if (showroomDetails?.showroom_status === "active") {
      toast({
        title:
          language === "en"
            ? "The Showroom is already verified"
            : "المعرض موثق بالفعل",
      });
      return;
    }
    if (showroomDetails?.showroom_status === "pending") {
      toast({
        title:
          language === "en"
            ? "The Showroom is already under review"
            : "يتم مراجعة المعرض بالفعل",
      });
      return;
    }
    try {
      await VerificationRequest("").unwrap();
      toast({
        title:
          language === "en"
            ? "The operation was completed successfully"
            : "نجحت العملية",
        description:
          language === "en"
            ? "Your request has been sent successfully"
            : "تم ارسال طلبك بنجاح",
      });
    } catch (error) {
      const errorMessage = error as ErrorType;
      toast({
        title: "خطأ",
        description: errorMessage.data?.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoaderSpan />;
  }
  if (isError) {
    return <h1>{language === "en" ? "Something went wrong" : "حدث خطاء"}</h1>;
  }

  if (!IsClient) return null;

  return (
    <main>
      <section className="h-auto lg:h-[80vh] mt-32">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${showroomDetails?.setting?.background_image}`}
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
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${showroomDetails?.setting?.logo}`}
              alt="Image Cover"
              width={400}
              height={500}
              className="h-[200px] rounded-xl w-full"
            />
            <Button
              variant={"secondary"}
              className="p-2 rounded-full absolute bottom-1 left-1"
              onClick={() => setOpenDialog(true)}
            >
              <Image
                src={"/Icons/pencil-edit-02 (1).png"}
                alt="Edit"
                width={20}
                height={20}
                className="h-full w-full rounded-full"
              />
            </Button>
          </div>

          <div
            className={`space-y-3 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <h2 className="text-xl font-semibold">
              {language === "en"
                ? showroomDetails?.setting?.showroom_en
                : showroomDetails?.setting?.showroom_ar}
            </h2>

            <p className="text-md break-words font-regular max-w-[300px]">
              {showroomDetails?.info}
            </p>
          </div>

          <div
            className="flex flex-col gap-4 items-start"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex border-b border-border justify-center w-full gap-10 pb-2">
              <h2>{language === "en" ? "Ads" : "الاعلانات"} :</h2>
              <h2>
                {showroom?.numberOfProducts}{" "}
                {language === "en" ? "Ads" : "إعلان"}
              </h2>
            </div>
            <div className="flex border-b border-border justify-center w-full gap-10 pb-2">
              <h2>{language === "en" ? "Followers" : "المتابعين"} :</h2>
              <h2>
                {showroom?.numberOfFollowers}{" "}
                {language === "en" ? "Follower" : "متابع"}
              </h2>
            </div>
          </div>

          <Button
            size={"lg"}
            className="bg-[#1E97B1] text-white hover:bg-[#1e96b1d0]"
            onClick={handlerVerificationRequest}
          >
            {showroomDetails?.showroom_status === "pending"
              ? language === "en"
                ? "Under Review"
                : "يتم مراجعة المعرض"
              : showroomDetails?.showroom_status === "active"
              ? language === "en"
                ? "Verified"
                : "تم التوثيق"
              : language === "en"
              ? "Verification Request"
              : "طلب توثيق"}
          </Button>
        </div>

        <div className="flex flex-col w-full gap-14">
          <div className="border-b border-border w-full pt-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {!showroomDetails?.category_id
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
                      (category) => category.id === showroomDetails?.category_id
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
          <div>
            <ProductsGrid
              products={products.filter(
                (product) => product.category_id === tabsCategory
              )}
              isError={isError}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      <DialogUpdateShowroom
        open={OpenDialog}
        setOpen={setOpenDialog}
        showroomDetails={showroomDetails}
      />
    </main>
  );
};

export default ExhibitionsPage;
