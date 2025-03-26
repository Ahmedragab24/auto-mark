import React from "react";
import { AllShowroomsType } from "@/types";
import SkeletonProduct from "./SkeletonProduct";
import { ShowroomCart } from "./ShowroomCart";

interface IProps {
  products: AllShowroomsType[];
  isError?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ShowroomGrid = ({ products, isError, isLoading, className }: IProps) => {
  return (
    <>
      {/* skeleton  */}
      {isLoading && <SkeletonProduct count={9} className="lg:!grid-cols-3" />}

      {/* Error */}
      {isError && (
        <div className="text-center flex items-center justify-center h-[50vh]">
          <p className="text-2xl font-semibold">
            عذر��ا حدث خطأ ما. حاول مجددا��.
          </p>
        </div>
      )}

      {/* No products */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center flex items-center justify-center h-[50vh]">
          <p className="text-2xl font-semibold">
            لا يوجد أي منتجات متوفرة حاليا.
          </p>
        </div>
      )}

      {/* Product Cards */}
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6 ${className}`}
        dir="rtl"
      >
        {!isLoading &&
          !isError &&
          products.length > 0 &&
          products.map((product: AllShowroomsType) => (
            <ShowroomCart key={product.id} product={product} />
          ))}
      </div>
    </>
  );
};

export default ShowroomGrid;
