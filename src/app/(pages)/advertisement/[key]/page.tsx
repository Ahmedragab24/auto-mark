"use client";

import CategoriesByCarItems from "@/components/advertisement/CategoriesByCarItems";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { toast } from "@/hooks/use-toast";
import { CategoriesKeyType } from "@/types";
import { getUserData } from "@/utils/userToken";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const params = useParams();
  const Router = useRouter();
  const PathName = (params?.key as CategoriesKeyType) || "car";
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
    if (PathName !== "car") {
      Router.push(`/advertisement/${PathName}/add-advertisement`);
    }
  }, [PathName, Router]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col gap-10 mt-36">
      <Breadcrumbs />
      {PathName === "car" && <CategoriesByCarItems />}
    </div>
  );
};

export default Page;
