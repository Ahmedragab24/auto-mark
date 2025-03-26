import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  className?: string;
  count?: number;
}

const SkeletonProduct = ({ className, count = 1 }: IProps) => {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      dir="rtl"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full flex flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[80%]" />
            <Skeleton className="h-6 w-[60%]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonProduct;
