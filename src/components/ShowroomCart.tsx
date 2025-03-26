import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { AllShowroomsType } from "@/types";
// import FavoriteBtnShowroom from "./exhibitions/FavoriteBtnShowroom";
import ShowroomContent from "./exhibitions/ShowroomContent";
// import FavoriteButton from "./auth/FavoriteButton";

interface IProps {
  product?: AllShowroomsType;
}

export function ShowroomCart({ product }: IProps) {
  return (
    <Link href={`/categories/showroom/${product?.user_id}`}>
      <Card className="w-full overflow-hidden transition-shadow duration-300 rtl group rounded-3xl hover:shadow-lg hover:bg-secondary">
        <div className="relative ">
          {/* Image Container with exact padding */}
          <div className="relative w-full h-56 overflow-hidden rounded-3xl">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${product?.logo}`}
              alt={product?.name || ""}
              fill
              loading="lazy"
              className="object-cover duration-300 rounded-3xl group-hover:scale-110"
            />
            {/* <div className="relative flex items-center gap-2 top-8">
              {product && (
                <>
                  <FavoriteButton product={product} />
                </>
              )}
            </div> */}
          </div>

          {/* Content Container */}
          {product && <ShowroomContent product={product} />}
        </div>
      </Card>
    </Link>
  );
}
