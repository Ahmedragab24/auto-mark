"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ProductType } from "@/types";
import { Cart } from "./Cart";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface IProducts {
  products: ProductType[];
}

export function SimilarProducts({ products }: IProducts) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { language } = useAppSelector((state: RootState) => state.Language);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;

    const updateButtons = () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    updateButtons(); // تحديث الحالة عند تحميل المكون لأول مرة

    swiper.on("slideChange", updateButtons);

    return () => {
      swiper.off("slideChange", updateButtons);
    };
  }, []);

  return (
    <div className="container px-4 py-8 relative">
      <h2
        className={`text-2xl font-bold mb-4 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {language === "en" ? "Related Ads" : "إعلانات ذات صلة"}
      </h2>
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={16}
        slidesPerView="auto"
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex-shrink-0 w-auto pb-4">
            <Cart product={product} lang={language} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* أزرار التنقل المخصصة */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-[15rem] transform -translate-y-1/2 z-10 bg-white dark:bg-black border border-primary text-primary shadow-md hover:bg-primary hover:text-white"
        aria-label="Previous"
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={isBeginning}
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-[15rem] transform -translate-y-1/2 z-10 bg-white dark:bg-black border border-primary text-primary shadow-md hover:bg-primary hover:text-white"
        aria-label="Next"
        onClick={() => swiperRef.current?.slideNext()}
        disabled={isEnd}
      >
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
