"use client";

import { useGetTermsQuery } from "@/store/apis/autoMarkInfo";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React from "react";

const Termspage = () => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data } = useGetTermsQuery(language);

  const termsContent = data?.data;

  return (
    <div
      className="container mx-auto py-8 px-6 md:px-14 bg-background rounded-xl"
      dir="ltr"
    >
      <h1 className="text-3xl font-bold text-center my-8">
        {language === "en" ? "Terms & Conditions" : "الشروط والاحكام"}
      </h1>
      <div
        className="prose mx-auto text-gray-600 dark:text-gray-400 leading-7"
        dangerouslySetInnerHTML={{ __html: termsContent }}
      />
    </div>
  );
};

export default Termspage;
