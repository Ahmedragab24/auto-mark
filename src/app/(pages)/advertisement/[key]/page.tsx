"use client";

import CategoriesByCarItems from "@/components/advertisement/CategoriesByCarItems";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { getUserData } from "@/utils/userToken";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AdvertisementKey = () => {
  const { typeAdvertisement } = useAppSelector(
    (state) => state.TypeAdvertisement
  );
  const Router = useRouter();
  const user = getUserData();

  useEffect(() => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يرجى تسجيل الدخول للوصول لهذه الصفحة",
        variant: "destructive",
      });
      Router.push("/");
    }
  }, [user, Router]);

  useEffect(() => {
    if (typeAdvertisement !== "car") {
      Router.push(`/advertisement/${typeAdvertisement}/add-advertisement`);
    }
  }, [typeAdvertisement, Router]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col gap-10 mt-36">
      <Breadcrumbs />
      {typeAdvertisement === "car" && <CategoriesByCarItems />}
    </div>
  );
};

export default AdvertisementKey;
