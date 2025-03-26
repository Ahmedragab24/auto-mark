"use client";

import { AddAdvertisement } from "@/components/advertisement/AddAdvertisement";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { toast } from "@/hooks/use-toast";
import { getUserData } from "@/utils/userToken";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const Router = useRouter();
  const user = getUserData();
  const [IsClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!user) return null;

  if (!IsClient) return null;

  return (
    <div className="container flex flex-col gap-10 px-4 py-10 mx-auto mt-36">
      <Breadcrumbs />

      <AddAdvertisement />
    </div>
  );
};

export default Page;
