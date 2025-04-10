import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { langType, ProductType } from "@/types";
import FavoriteButton from "./auth/FavoriteButton";
import ProductContent from "./ProductCart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "السيارات - التجاره السعودية",
  description: "تجربة عنوان وصف يصل ��لى 150 حرف",
  keywords: ["سيارات", "تجاره السعودية", "تجربة عنوان وصف"],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "السيارات - التجاره السعودية",
    description: "تجربة عنوان وصف يصل ��لى 150 حرف",
  },
};

interface IProps {
  product?: ProductType;
  lang: langType;
}

export function Cart({ product, lang }: IProps) {
  return (
    <Card className="overflow-hidden relative transition-shadow duration-300 rtl group rounded-3xl hover:shadow-lg hover:bg-secondary">
      <Link href={`/categories/${product?.id}`}>
        {/* Image Container with exact padding */}
        <div className="relative w-full h-auto overflow-hidden rounded-3xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${product?.image}`}
            alt={product?.name || ""}
            width={800}
            height={800}
            loading="lazy"
            className="object-cover w-full h-64 duration-300 rounded-3xl group-hover:scale-110"
          />
        </div>

        {/* Content Container */}
        {product && <ProductContent product={product} />}
      </Link>

      <div className="absolute flex items-center justify-between w-full top-8">
        {product && (
          <>
            <FavoriteButton
              product={product}
              className="absolute rounded-full left-4"
              type="Cart"
            />
            {product?.is_paid_advertisement && (
              <span className="absolute px-3 py-2 font-medium rounded-lg right-4 gradient-spacial text-bodyS">
                {lang === "en" ? "special" : "مميز"}
              </span>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
