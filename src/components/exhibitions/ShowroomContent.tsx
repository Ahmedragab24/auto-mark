import { AllShowroomsType } from "@/types";
import { MapPin } from "lucide-react";
import React from "react";

interface IProps {
  product: AllShowroomsType;
}

const ShowroomContent = ({ product }: IProps) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Title and Price Row */}
      {product.name && (
        <h3 className="text-bodyL font-regular">{product.name}</h3>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin size={16} />
        <span>{product?.name}</span>
      </div>
    </div>
  );
};

export default ShowroomContent;
