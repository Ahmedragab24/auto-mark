import { Cart } from "./Cart";
import { ProductType } from "@/types";
import SkeletonProduct from "./SkeletonProduct";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

interface IProps {
  products: ProductType[];
  isError?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ProductsGrid = ({
  products = [],
  isError,
  isLoading,
  className,
}: IProps) => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  if (!isClient) return null;

  return (
    <>
      {/* عرض الهيكل العظمي أثناء التحميل */}
      {isLoading && <SkeletonProduct count={9} className="lg:!grid-cols-3" />}

      {/* عرض رسالة الخطأ */}
      {isError && (
        <div className="text-center flex items-center justify-center h-[50vh]">
          <p className="text-2xl font-semibold">
            {language === "ar"
              ? "عذرا حدث خطأ ما. حاول مجددا."
              : "Error occurred. Please try again."}
          </p>
        </div>
      )}

      {/* لا توجد منتجات */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center flex items-center justify-center h-[50vh]">
          <p className="text-2xl font-semibold">
            {language === "ar"
              ? "لا يوجد منتجات متوفرة حاليا."
              : "No products available."}
          </p>
        </div>
      )}

      {/* عرض المنتجات */}
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6 ${className}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {!isLoading &&
          !isError &&
          products.map((product: ProductType) => (
            <Cart key={product.id} product={product} lang={language} />
          ))}
      </div>
    </>
  );
};

export default ProductsGrid;
