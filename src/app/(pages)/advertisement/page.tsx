"use client";

import * as React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/utils/userToken";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  useChangeStatusAdvertisementMutation,
  useDeleteAdvertisementsUserMutation,
  useGetAdvertisementsUserQuery,
  useRepostAdvertisementMutation,
} from "@/store/apis/advertisement";
import type {
  ErrorType,
  ExpiredAdvertisementType,
  langType,
  ProductType,
} from "@/types";
import {
  CarFront,
  CircleGauge,
  CircleSlash2,
  Eye,
  Loader,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import EditAdvertisementModel from "@/components/advertisement/EditAdvertisementModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PackagesModel from "@/components/advertisement/packagesModel";
import Link from "next/link";
import PaginationProducts from "@/components/PaginationProducts";
import { setCurrentPage } from "@/store/features/currentPage";
import AddBannerBtn from "@/components/AddBannerBtn";
import LoaderSpan from "@/components/LoaderSpan";

export default function CarRentalList() {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { currentPage } = useAppSelector(
    (state: RootState) => state.CurrentPage
  );
  const [typeExpired, setTypeExpired] =
    React.useState<ExpiredAdvertisementType>("new");
  const { data, isLoading } = useGetAdvertisementsUserQuery(
    {
      key: typeExpired,
      lang: language,
      page: currentPage,
    },
    {
      pollingInterval: 2000,
    }
  );
  const totalPages = data?.data?.products?.last_page || 1;
  const [advertisements, setAdvertisements] = React.useState<ProductType[]>([]);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null);
  const [isClient, setIsClient] = React.useState(false);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const userData = getUserData();
    setUser(userData);

    if (!userData) {
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
  }, [router, language]);

  React.useEffect(() => {
    if (data?.data?.products?.data) {
      const adsArray = Array.isArray(data.data.products.data)
        ? data.data.products.data
        : [data.data.products.data];

      setAdvertisements(
        adsArray.map((ad: ProductType) => ({
          ...ad,
          image: ad.image
            ? ad.image.startsWith("http")
              ? ad.image
              : `${process.env.NEXT_PUBLIC_BASE_URL}${ad.image}`
            : "/placeholder.svg",
        }))
      );
    }
  }, [data]); // Added data as dependency to update when query data changes

  // Handle tab change
  const handleTabChange = (value: string) => {
    setTypeExpired(value === "current" ? "new" : "old");
    dispatch(setCurrentPage(1));
  };

  if (!user) return null;

  if (!isClient) return null;

  return (
    <div className="container px-4 py-10 mx-auto mt-36 relative">
      <Breadcrumbs />
      <Tabs
        defaultValue="current"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex justify-center w-full">
          <TabsList className="w-full p-8 mb-6 md:w-1/2 rounded-2xl">
            <TabsTrigger
              value="current"
              className="w-1/2 data-[state=active]:bg-primary rounded-lg data-[state=active]:text-white"
            >
              {language === "en" ? "Current" : "الجارية"}
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="w-1/2 data-[state=active]:bg-primary rounded-lg data-[state=active]:text-white"
            >
              {language === "en" ? "Expired" : "المنتهية"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" dir={language === "en" ? "ltr" : "rtl"}>
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <LoaderSpan />
            </div>
          )}

          {!isLoading && advertisements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {advertisements.map((ad) => (
                <CarListingCard
                  key={ad.id}
                  ad={ad}
                  isExpired={false}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg md:text-xl py-8 text-gray-500 flex gap-2 items-center justify-center">
              <CircleSlash2 className="inline-block w-8 h-8 text-primary" />
              {language === "en" ? "No current ads" : "لا يوجد إعلانات حالية"}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" dir={language === "en" ? "ltr" : "rtl"}>
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <Loader className="animate-spin text-primary" />
            </div>
          )}

          {!isLoading && advertisements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {advertisements.map((ad) => (
                <CarListingCard
                  key={ad.id}
                  ad={ad}
                  isExpired={true}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg md:text-xl py-8 text-gray-500 flex gap-2 items-center justify-center">
              <CircleSlash2 className="inline-block w-8 h-8 text-primary" />
              {language === "en" ? "No expired ads" : "لا يوجد إعلانات منتهية"}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddBannerBtn className="absolute top-[1.7rem] lg:top-[5.2rem] left-6" />

      {totalPages > 1 && <PaginationProducts totalPages={totalPages} />}
    </div>
  );
}

function CarListingCard({
  ad,
  isExpired,
  language,
}: {
  ad: ProductType;
  isExpired: boolean;
  language: langType;
}) {
  const [IsModelOpen, IsModelOpenChange] = React.useState(false);
  const [ReportAdvertisement] = useChangeStatusAdvertisementMutation();
  const [RepostAdvertisement] = useRepostAdvertisementMutation();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDialogOpenOfPackage, setIsDialogOpenOfPackage] =
    React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const [DeleteAdvertisement, { isLoading: isLoadingDelete }] =
    useDeleteAdvertisementsUserMutation();
  const handleAction = async (onProduct: ProductType) => {
    if (isExpired) {
      try {
        if (!onProduct?.id) return;
        await RepostAdvertisement(onProduct.id).unwrap();

        toast({
          title:
            language === "en"
              ? "The operation was completed successfully."
              : "تمت العملية بنجاح",
          description:
            language === "en" ? "Report successful" : "تم تجديد الإعلان",
        });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "en" ? "Error" : "خطاء",
          description: error?.data?.message || "حدث خطأ أثناء التجديد",
          variant: "destructive",
        });
      }
    } else {
      IsModelOpenChange(true);
    }
  };

  const handlerActive = async (onProduct: ProductType) => {
    if (onProduct.status) {
      try {
        if (!onProduct?.id) return;
        await ReportAdvertisement({
          productID: onProduct.id,
          status: { status: false },
        }).unwrap();

        toast({
          title:
            language === "en"
              ? "The operation was completed successfully."
              : "تمت العملية بنجاح",
          description:
            language === "en" ? "The ad has been stopped." : "تم إيقاف الإعلان",
        });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "en" ? "Error" : "خطاء",
          description: error?.data?.message || "حدث خطأ أثناء التجديد",
          variant: "destructive",
        });
      }
    } else {
      try {
        if (!onProduct?.id) return;
        await ReportAdvertisement({
          productID: onProduct.id,
          status: { status: true },
        }).unwrap();

        toast({
          title:
            language === "en"
              ? "The operation was completed successfully."
              : "تمت العملية بنجاح",
          description:
            language === "en"
              ? "The ad has been activated."
              : "تم تفعيل الإعلان",
        });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "en" ? "Error" : "خطاء",
          description: error?.data?.message || "حدث خطأ أثناء التجديد",
          variant: "destructive",
        });
      }
    }
  };

  const confirmRemove = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, onProduct: ProductType) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (!onProduct?.id) return;
        await DeleteAdvertisement(onProduct?.id).unwrap();
        toast({
          title:
            language === "en"
              ? "The operation was completed successfully."
              : "تمت العملية بنجاح",
          description:
            language === "en"
              ? "The ad has been successfully deleted."
              : "تم حذف الإعلان",
        });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "en" ? "Error" : "خطاء",
          description: error?.data?.message || "حدث خطأ أثناء الحذف",
          variant: "destructive",
        });
      }
    },
    [DeleteAdvertisement, language]
  );

  const cancelRemove = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDialogOpen(false);
    },
    []
  );

  if (!isClient) return null;

  return (
    <>
      <Card
        className="mb-6 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 inline-block group"
        dir={language === "en" ? "ltr" : "rtl"}
      >
        <div className="flex gap-2 flex-col xl:flex-row justify-center items-center p-4">
          {/* Right side - Car image */}
          <div className="relative w-[300px] h-[220px] shrink-0">
            <Image
              src={ad.image || "/placeholder.svg"}
              alt={ad.name || "default"}
              fill
              className="object-cover rounded-xl group-hover:scale-95 transition-all duration-300"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute flex items-center justify-between w-full top-8">
              {ad && (
                <>
                  {ad?.is_paid_advertisement && (
                    <span className="absolute px-3 py-2 font-medium rounded-lg right-4 gradient-spacial text-bodyS">
                      {language === "en" ? "special" : "مميز"}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Left side - Car details */}
          <div className="flex flex-col justify-between px-4">
            <div className="flex flex-col">
              <div className="flex justify-between gap-4 items-center mb-2">
                <h2 className="text-xl font-bold mb-1">{ad.name}</h2>
                <Link href={`/categories/${ad.id}`}>
                  <Eye className="w-6 h-6 text-gray-500 duration-300 cursor-pointer hover:text-primary" />
                </Link>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-500 mb-3">
                {/* Days left indicator now at the top */}

                {isExpired ? null : (
                  <div className="text-primary font-medium">
                    {ad.days} {language === "en" ? "days left" : "يوم متبقي"}
                  </div>
                )}

                {/* Location information below */}
                <div className="flex gap-1 items-center">
                  <Image
                    src="/Icons/location.png"
                    alt="location"
                    width={14}
                    height={14}
                  />
                  <span>
                    {ad?.country?.name} - {ad.city?.name}
                  </span>
                </div>
              </div>

              {ad?.standard_specification &&
                ad?.standard_specification.length > 0 && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex gap-1 items-center">
                      <span>
                        {ad?.standard_specification &&
                          ad.standard_specification.find(
                            (s) => s.key === "mileage"
                          )?.value_en}
                        {language === "en" ? "km" : "كم"}
                      </span>
                      <CircleGauge className="w-4 h-4 mr-1" />
                    </div>
                    <div className="flex gap-1 items-center">
                      <span>
                        {ad?.standard_specification &&
                          ad.standard_specification.find(
                            (s) => s.key === "manufacturing_year"
                          )?.value_en}
                      </span>
                      <CarFront className="w-4 h-4 mr-1" />
                    </div>
                    <div className="flex items-center">
                      <span>{ad?.motion_vector}</span>
                    </div>
                  </div>
                )}

              <div className="flex items-center mb-4">
                <div className="text-[#AE0000] font-bold text-xl" dir="rtl">
                  {ad.price} {ad.country?.symbol}
                </div>
                <span className="text-gray-500 mx-1">/ {ad?.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="sm"
                onClick={() => handleAction(ad)}
                className="bg-[#50a556] hover:bg-[#50a556]/90"
              >
                {isExpired
                  ? language === "en"
                    ? "Resubmit"
                    : "إعادة نشر الإعلان"
                  : language === "en"
                  ? "Update"
                  : "تعديل"}
              </Button>

              {!isExpired && !ad?.is_paid_advertisement && (
                <Button
                  className="bg-[#0065ae] hover:bg-[#0065ae]/90"
                  size="sm"
                  onClick={() => setIsDialogOpenOfPackage(true)}
                >
                  {isLoadingDelete ? (
                    <Loader className="animate-spin mr-2" />
                  ) : language === "en" ? (
                    "special"
                  ) : (
                    "تمييز"
                  )}
                </Button>
              )}

              {!isExpired && (
                <Button
                  className="bg-[#d8a235] hover:bg-[#d8a235]/90"
                  size="sm"
                  onClick={() => handlerActive(ad)}
                >
                  {isLoadingDelete ? (
                    <Loader className="animate-spin mr-2" />
                  ) : language === "en" ? (
                    ad?.status ? (
                      "Stop"
                    ) : (
                      "Active"
                    )
                  ) : ad?.status ? (
                    "ايقاف"
                  ) : (
                    "تفعيل"
                  )}
                </Button>
              )}

              {!isExpired && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isLoadingDelete}
                >
                  {isLoadingDelete ? (
                    <Loader className="animate-spin mr-2" />
                  ) : language === "en" ? (
                    "Delete"
                  ) : (
                    "حذف"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <EditAdvertisementModel
        IsModelOpen={IsModelOpen}
        IsModelOpenChange={IsModelOpenChange}
        productID={ad.id || 0}
      />

      {ad.id && (
        <PackagesModel
          isDialogOpenOfPackage={isDialogOpenOfPackage}
          setIsDialogOpenOfPackage={setIsDialogOpenOfPackage}
          productId={ad.id}
        />
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="flex flex-col items-center justify-center w-full md:w-fit">
          <AlertDialogTitle className="flex gap-2">
            {language === "en" ? "Delete" : "حذف"}
            <Trash2 className="w-6 h-6 text-primary" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "en"
              ? "Are you sure you want to delete this advertisement"
              : "هل انت متاكد من حذف هذا الإعلان؟"}
          </AlertDialogDescription>
          <AlertDialogAction
            onClick={(e) => confirmRemove(e, ad)}
            className="w-full"
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin mr-2" />
                {language === "en" ? "Deleting..." : "جاري الحذف..."}
              </div>
            ) : language === "en" ? (
              "Delete"
            ) : (
              "حذف"
            )}
          </AlertDialogAction>
          <AlertDialogCancel onClick={cancelRemove} className="w-full">
            {language === "en" ? "Cancel" : "الغاء"}
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
