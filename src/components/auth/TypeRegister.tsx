"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { AlertTriangle, Car, Store, User } from "lucide-react";
import { ModelType } from "./LoginModel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTypeRegister } from "@/store/features/typeRegister";
import { RootState } from "@/store/store";

interface RegisterFormProps {
  setTypeModel: (type: ModelType) => void;
}

const TypeRegister = ({ setTypeModel }: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedLanguage = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const storeLanguage = isClient ? selectedLanguage : "ar";

  useEffect(() => {
    setLanguage(storeLanguage);
  }, [storeLanguage]);

  const texts = {
    ar: {
      user: "مستخدم عادي",
      vendor: "تاجر",
      showroom: "معرض",
      alert:
        "المستخدم والتاجر ليس لهما صفحة عرض (بروفايل) لعرض اعلانتهما اما المعرض له صفحة للاعلانات بشكل منفصل",
    },
    en: {
      user: "Regular User",
      vendor: "Vendor",
      showroom: "Showroom",
      alert:
        "Users and vendors do not have a profile page to display their ads, while showrooms have a separate ad page.",
    },
  };

  const t = texts[language] || texts.ar;

  if (!isClient) return null; // 🔹 حل مشكلة الهيدريشن

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:gap-8 items-center justify-center py-4 md:py-10 px-4">
        <div className="grid grid-cols-1 gap-2 md:gap-6 w-max md:grid-cols-3">
          <button className="focus:outline-none group">
            <Card
              className="w-full p-4 md:p-8 text-center transition-colors hover:bg-secondary"
              onClick={() => {
                setTypeModel("Register");
                dispatch(setTypeRegister("user"));
              }}
            >
              <div className="flex justify-center mb-4">
                <User className="w-10 md:w-16 h-10 md:h-16 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h2 className="text-md md:text-xl font-medium">{t.user}</h2>
            </Card>
          </button>

          <button className="focus:outline-none group">
            <Card
              className="w-full p-4 md:p-8 text-center transition-colors hover:bg-secondary"
              onClick={() => {
                setTypeModel("Register");
                dispatch(setTypeRegister("vendor"));
              }}
            >
              <div className="flex justify-center mb-4">
                <Car className="w-10 md:w-16 h-10 md:h-16 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h2 className="text-md md:text-xl font-medium">{t.vendor}</h2>
            </Card>
          </button>

          <button className="focus:outline-none group">
            <Card
              className="w-full p-4 md:p-8 text-center transition-colors hover:bg-secondary"
              onClick={() => {
                setTypeModel("ExhibitionsRegister");
                dispatch(setTypeRegister("showroom"));
              }}
            >
              <div className="flex justify-center mb-4">
                <Store className="w-10 md:w-16 h-10 md:h-16 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h2 className="text-md md:text-xl font-medium">{t.showroom}</h2>
            </Card>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 p-4 rounded-lg text-amber-600 bg-amber-50">
          <AlertTriangle className="w-5 h-5" />
          <p
            className={`text-bodyS md:text-sm ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.alert}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypeRegister;
