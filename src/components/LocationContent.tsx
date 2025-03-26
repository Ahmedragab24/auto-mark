import { AllShowroomsType } from "@/types";
import React from "react";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

interface IProps {
  showroom: AllShowroomsType;
}

const LocationContent = ({ showroom }: IProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Button variant={"secondary"}>{showroom?.name}</Button>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <h3>{showroom?.name}</h3>
        <MapPin />
      </div>
    </div>
  );
};

export default LocationContent;
