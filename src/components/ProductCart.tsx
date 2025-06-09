"use client";

import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ProductType } from "@/types";
import { formatPrice } from "@/utils/FormatPrice";
import { CarFront, CircleGauge, IdCard, MapPin } from "lucide-react";
import type React from "react";

interface ProductContentProps {
  product: ProductType;
}

const ProductContent: React.FC<ProductContentProps> = ({ product }) => {
  const { language } = useAppSelector((state: RootState) => state.Language);

  const getMileage = () => {
    const mileageSpec = product.standard_specification?.find(
      (spec) => spec.key === "mileage"
    );
    return mileageSpec?.value_en || "";
  };

  const getManufacturingYear = () => {
    const yearSpec = product.standard_specification?.find(
      (spec) => spec.key === "manufacturing_year"
    );
    return yearSpec?.value_en || "";
  };

  const getCarNumber = () => {
    const CarNumSpec = product.standard_specification?.find(
      (spec) => spec.key === "plate_number"
    );
    return CarNumSpec?.value_en || "";
  };

  return (
    <div
      className="flex flex-col gap-3 p-4"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      {product.price && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-semibold text-bodyL text-primary">
            <span>{formatPrice(product.price)}</span>
            <span>{product.country?.symbol}</span>
          </div>
          {product.type && (
            <span className="p-2 text-center font-semibold text-gray-600 border border-gray-600 rounded-full text-[9px]">
              {product.type}
            </span>
          )}
        </div>
      )}

      <h3 className="text-bodyL font-regular">{product.name}</h3>

      {product?.city?.name && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          {product.city?.name && <span>{product.city.name}</span>}
        </div>
      )}

      {product?.standard_specification &&
        product?.standard_specification.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {getMileage() && (
              <div className="flex items-center gap-2">
                <CircleGauge className="w-5 h-5" />
                <span>
                  {getMileage()} {language === "en" ? "km" : "كم"}
                </span>
              </div>
            )}

            {getMileage() && getManufacturingYear() && (
              <div className="w-[1px] h-8 bg-gray-500" />
            )}

            {getManufacturingYear() && (
              <div className="flex items-center gap-2">
                <CarFront className="w-5 h-5" />
                <span>{getManufacturingYear()}</span>
              </div>
            )}

            {getCarNumber() && (
              <div className="flex items-center gap-2">
                <IdCard className="w-5 h-5" />
                <span>{getCarNumber()}</span>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default ProductContent;
