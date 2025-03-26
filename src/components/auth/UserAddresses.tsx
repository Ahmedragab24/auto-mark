"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Address, clearAddress } from "@/store/features/Addrees";
import { CircleOff, Trash2 } from "lucide-react";

const UserAddresses = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const addresses = useAppSelector((state: RootState) => state.Address);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className="flex flex-col gap-4 px-2 py-6 md:py-20 md:px-8 bg-background rounded-xl"
      dir="rtl"
    >
      {!addresses.length ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <CircleOff className="w-12 h-12 text-gray-400" />
          <p className="text-2xl text-gray-600">
            {language === "ar" ? "لا يوجد عناوين" : "No addresses"}
          </p>
        </div>
      ) : (
        addresses.map((address: Address) => (
          <Card
            key={address.id}
            className="overflow-hidden bg-transparent border border-border rounded-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">
                    {language === "en"
                      ? address.country_en
                      : address.country_ar}
                  </h3>
                  <h3 className="text-lg font-semibold">
                    {language === "en" ? address.city_en : address.city_ar}
                  </h3>
                  <p className="text-gray-600">{address.address}</p>
                  <div className="flex item-center">
                    <p className="text-gray-600">{address?.phone}</p>
                    <p className="text-gray-600">{address?.iso_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => dispatch(clearAddress(address.id))}
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <div className="flex items-center justify-center mt-10">
        <Button size={"lg"} variant="secondary" className="w-[50%] h-12">
          <Link href={"/user/address/add-address"}>
            {language === "ar" ? "اضافة عنوان جديد" : "Add New Address"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UserAddresses;
