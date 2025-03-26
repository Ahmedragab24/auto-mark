"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircleMore,
  Phone,
  Printer,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useGetProductsByIdQuery } from "@/store/apis/products";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ProductType } from "@/types";
import Link from "next/link";
import { SimilarProducts } from "@/components/SimilarProducts";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import FavoriteButton from "@/components/auth/FavoriteButton";
import SendMessageBtn from "@/components/SendMassageBtn";
import LoaderSpan from "@/components/LoaderSpan";
import ShareBtn from "@/components/ShareBtn";
import { Badge } from "@/components/ui/badge";
import ReportAdBtn from "@/components/ReportAdBtn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/utils/FormatPrice";
import ImageLightbox from "@/components/image-lightbox";

export default function CarDetails() {
  const params = useParams() as { productID: string };
  const { productID } = params;
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const { data, isLoading } = useGetProductsByIdQuery({
    id: Number(productID),
    lang: language,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const product: ProductType = data?.data?.product;
  const [isClient, setIsClient] = useState(false);

  // console.log("product", product);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNextImage = () => {
    if (product?.images && product?.images?.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % (product?.images?.length ?? 0)
      );
    }
  };

  const handlePrevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + (product?.images?.length ?? 1)) %
          (product?.images?.length ?? 0)
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (isLoading || !isClient) {
    return (
      <div className="min-h-[50vh] mt-36 w-full h-auto">
        <LoaderSpan />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] mt-36 w-full h-auto">
        <p>{language === "en" ? "Product not found" : "المنتج غير موجود"}</p>
      </div>
    );
  }

  return (
    <div className="mt-36 w-full h-auto">
      <div className="container px-4 py-6 mx-auto space-y-10">
        <Breadcrumbs />

        <div
          className="w-full grid grid-cols-1 gap-10 md:gap-6 lg:grid-cols-3"
          dir={language === "en" ? "ltr" : "rtl"}
        >
          {/* Main Content - Images and Details */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl">
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{product.name}</h1>

                {product.price && (
                  <div className="flex gap-2 text-2xl font-bold text-primary">
                    <span className="text-2xl font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-2xl font-semibold text-primary">
                      {product.country?.symbol}
                    </span>
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="relative mt-6 rounded-2xl overflow-hidden w-full h-auto lg:h-[500px]">
                {product.images && product.images.length > 0 ? (
                  <>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[currentImageIndex].image}`}
                      alt={`Car image ${currentImageIndex + 1}`}
                      width={1600}
                      height={900}
                      quality={100}
                      className="object-cover w-full h-full cursor-pointer"
                      loading="eager"
                      priority
                      sizes="(max-width: 768px) 100vw, 1200px"
                      unoptimized
                      onClick={openLightbox}
                    />
                    <button
                      onClick={openLightbox}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : product.image ? (
                  <div className="relative w-full h-full min-h-[300px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
                      alt="Car image"
                      fill
                      quality={100}
                      className="object-contain"
                      loading="eager"
                      priority
                      sizes="(max-width: 768px) 100vw, 1200px"
                      unoptimized
                      onClick={openLightbox}
                    />

                    <button
                      onClick={openLightbox}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : null}

                {/* Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute p-2 transition -translate-y-1/2 rounded-full shadow-md left-4 top-1/2 bg-black/80 hover:bg-black"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute p-2 transition -translate-y-1/2 rounded-full shadow-md right-4 top-1/2 bg-black/80 hover:bg-black"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 px-2 pb-4 mt-4  overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative w-20 h-16 lg:w-24 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden transition ${
                        currentImageIndex === index ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${image.image}`}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Lightbox Component */}
              {product.images && product.images.length > 0 && (
                <ImageLightbox
                  images={product.images}
                  initialIndex={currentImageIndex}
                  isOpen={lightboxOpen}
                  onClose={closeLightbox}
                  baseUrl={process.env.NEXT_PUBLIC_BASE_URL || ""}
                  language={language}
                />
              )}

              {/* standardSpecification */}
              {product.standardSpecification &&
                product.standardSpecification.length > 0 && (
                  <div className="my-12">
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                      {language === "en"
                        ? "Standard Specification"
                        : "المواصفات"}
                    </h2>
                    <div className="grid grid-cols-2 justify-center items-center gap-2 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {product.standardSpecification.map((spec, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden  transition-shadow hover:shadow-sm hover:bg-secondary"
                        >
                          <CardContent className="p-1 flex flex-col justify-center items-start border-b border-border">
                            <Badge
                              variant="secondary"
                              className="mb-3 text-sm font-medium"
                            >
                              {language === "en"
                                ? spec.title_en
                                : spec.title_ar}
                            </Badge>
                            <p className="text-sm leading-relaxed text-muted-foreground px-2">
                              {language === "en"
                                ? spec.value_en
                                : spec.value_ar}
                            </p>
                          </CardContent>
                        </Card>
                      ))}

                      {product?.motion_vector &&
                        (product?.category_id === 1 ||
                          product?.category_id === 3 ||
                          product?.category_id === 8) && (
                          <Card className="overflow-hidden transition-shadow hover:shadow-sm hover:bg-secondary">
                            <CardContent className="p-1 flex flex-col justify-center items-start border-b border-border">
                              <Badge
                                variant="secondary"
                                className="mb-3 text-sm font-medium"
                              >
                                {language === "en"
                                  ? "Motion Vector"
                                  : "ناقل الحركة"}
                              </Badge>
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {product?.motion_vector === "auto"
                                  ? language === "en"
                                    ? "Auto"
                                    : "اتوماتيكي"
                                  : language === "en"
                                  ? "manual"
                                  : "يدوي"}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                      {(product?.category_id === 1 ||
                        product?.category_id === 2 ||
                        product?.category_id === 3 ||
                        product?.category_id === 4 ||
                        product?.category_id === 8) && (
                        <Card className="overflow-hidden transition-shadow hover:shadow-sm hover:bg-secondary">
                          <CardContent className="p-1 flex flex-col justify-center items-start border-b border-border">
                            <Badge
                              variant="secondary"
                              className="mb-3 text-sm font-medium"
                            >
                              {language === "en" ? "The Warranty" : "الضمان"}
                            </Badge>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {product?.warranty === 1
                                ? language === "en"
                                  ? "There is"
                                  : "يوجد"
                                : language === "en"
                                ? "There is no"
                                : "لا يوجد"}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              {product.description_en && (
                <div className="my-8">
                  <h2 className="mb-4 text-lg font-semibold">
                    {language === "en" ? "Description" : "وصف"}
                  </h2>
                  <p className="leading-relaxed text-gray-600 max-w-full overflow-hidden break-words">
                    {product.description_en}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col justify-center lg:items-end">
              <TooltipProvider>
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <FavoriteButton product={product} type="Page" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {language === "en"
                            ? "Add to favorites"
                            : "اضف للمفضلة"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <ShareBtn />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{language === "en" ? "Share" : "مشاركة"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                          onClick={() => window.print()}
                        >
                          <Printer className="w-5 h-5" />
                          <span className="sr-only">
                            {language === "en" ? "Print" : "طباعة"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {language === "en"
                            ? "Print this page"
                            : "طباعة هذه الصفحة"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <ReportAdBtn product={product} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{language === "en" ? "Report" : "ابلاغ"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" className="rounded-full">
                          {product.type}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {language === "en" ? "Price Status" : "حالة السعر"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
            </div>

            {/* Dealer Card */}
            <Card className="p-6 border rounded-2xl border-border">
              <Link
                href={
                  product?.user?.type === "showroom"
                    ? `/categories/showroom/${product?.setting?.user_id}`
                    : `#`
                }
                className="flex items-center gap-3 mb-6 hover:text-primary group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full duration-200 group-hover:scale-105">
                  <Image
                    src={
                      product?.setting?.logo
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}${product?.setting?.logo}`
                        : `/Logo/user.png`
                    }
                    alt="Auto Motors"
                    width={32}
                    height={32}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <div className="font-semibold">{product.user?.name}</div>
                  <div className="text-xs text-gray-500">تاجر معتمد</div>
                </div>
              </Link>

              <div className="space-y-3">
                <Button className="w-full h-12 text-base ">
                  <Link
                    href={`tel:${product.phone}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center w-full gap-2"
                  >
                    {language === "en" ? "Call" : "اتصال"}
                    <Phone className="w-6 h-6" />
                  </Link>
                </Button>

                <Button className="w-full h-12 text-base bg-green-500 hover:bg-green-600">
                  <Link
                    href={`https://wa.me/${product.phone}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center w-full gap-2"
                  >
                    {language === "en" ? "WhatsApp" : "واتساب"}
                    <MessageCircleMore className="w-6 h-6" />
                  </Link>
                </Button>

                <SendMessageBtn product={product} />
              </div>
            </Card>

            {/* Location Card */}
            {product.latitude &&
              product.latitude?.length > 1 &&
              product.longitude &&
              product.longitude?.length > 1 && (
                <Card className="p-6 border rounded-2xl border-border">
                  <div className="flex  gap-2 items-center mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {language === "en" ? "Location" : "الموقع"}
                      </span>
                      <span className="text-primary">/</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 text-sm">
                      {product.country?.name && (
                        <span>{product.country.name}</span>
                      )}
                      {product.city?.name && (
                        <span>( {product.city.name} )</span>
                      )}
                    </div>
                  </div>
                  <iframe
                    className="w-full h-64 m-auto rounded-md"
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d54579.92187944465!2d${product.longitude}!3d${product.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1741196309946!5m2!1sar!2seg`}
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Card>
              )}
          </div>
        </div>

        {/* Similar Products */}
        {data?.data?.related_products &&
          data.data.related_products.length > 0 && (
            <SimilarProducts products={data.data.related_products} />
          )}
      </div>
    </div>
  );
}
