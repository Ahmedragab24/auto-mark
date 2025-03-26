import { MapPin, Phone } from "lucide-react";
import React from "react";

interface IProps {
  title: string;
  location?: string;
  phone?: string;
}

const LocationCart = ({ title, location, phone }: IProps) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Title */}
      <h3 className="w-fit text-bodyL font-regular px-4 py-2 bg-gray-30 rounded-xl">
        {title}
      </h3>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} />
          <span dir="ltr">{phone}</span>
        </div>
      )}
    </div>
  );
};

export default LocationCart;
