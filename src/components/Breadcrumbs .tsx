"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

const translations: Record<string, Record<string, string>> = {
  ar: {
    home: "الرئيسية",
    categories: "الاقسام",
    car: "سيارة",
    motorcycle: "دراجة نارية",
    truck: "شاحنة",
    boat: "قارب",
    service: "خدمة",
    carNumber: "لوحة سيارة",
    vehicles: "مركبات",
    scrap: "سيارات سكراب",
    services: "خدمات",
    showroom: "المعارض",
    spare_parts: "قطع الغيار",
    car_numbers: "لوحات السيارات",
    "add-advertisement": "اضافة اعلان جديد",
    vehicleInformation: "معلومات المركبة",
    advertisement: "الاعلانات",
    user: "حسابي",
    address: "العناوين",
    "add-address": "أضف عنوان جديد",
    "edit-address": "تعديل العنوان",
    payment: "بطاقات الدفع",
    "add-payment": "اضافة بطاقة جديدة",
    "edit-payment": "تعديل بطاقة الدفع",
    "change-Password": "تغيير كلمة المرور",
    "upgrade-account": "ترقية الحساب",
    packages: "الباقات",
    notifications: "الاشعارات",
    category: "الاقسام",
    favorites: "المفضلة",
    SupportCenter: "مركز الدعم",
    terms: "الشروط والاحكام",
    privacy: "سياسة الخصوصية",
    contact: "اتصل بنا",
    "download-app": "تحميل التطبيق",
    "download.html": "تحميل التطبيق",
  },
  en: {
    home: "Home",
    categories: "Categories",
    car: "Car",
    motorcycle: "Motorcycle",
    truck: "Truck",
    boat: "Boat",
    service: "Service",
    carNumber: "Car Number",
    vehicles: "Vehicles",
    scrap: "Scrap Cars",
    services: "Services",
    showroom: "Showrooms",
    spare_parts: "Spare Parts",
    car_numbers: "Car Numbers",
    "add-advertisement": "Add New Advertisement",
    vehicleInformation: "Vehicle Information",
    advertisement: "Advertisements",
    user: "My Account",
    address: "Addresses",
    "add-address": "Add New Address",
    "edit-address": "Edit Address",
    payment: "Payment Cards",
    "add-payment": "Add New Card",
    "edit-payment": "Edit Payment Card",
    "change-Password": "Change Password",
    "upgrade-account": "Upgrade Account",
    packages: "Packages",
    notifications: "Notifications",
    category: "Categories",
    favorites: "Favorites",
    SupportCenter: "Support Center",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    contact: "Contact Us",
    "download-app": "Download App",
    "download.html": "Download App",
  },
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = (pathname ?? "")
    .split("/")
    .filter((segment) => segment !== "");

  const selectedLanguage = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(selectedLanguage);
  }, [selectedLanguage]);

  if (!language) return null;

  const currentTranslations = translations[language] || translations["ar"];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
      <ol className="inline-flex p-0 list-none">
        <li className="flex items-center text-bodyS md:text-sm">
          <Link
            href="/"
            className="transition-colors duration-200 ease-in-out hover:text-primary"
          >
            {currentTranslations.home}
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          const translatedSegment = currentTranslations[segment] || segment;

          return (
            <li key={href} className="flex items-center text-bodyS md:text-sm">
              <ChevronLeftIcon className="w-4 h-4 mx-1 md:mx-2" />
              {isLast ? (
                <span className="font-medium text-gray-500">
                  {translatedSegment}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors duration-200 ease-in-out hover:text-primary"
                >
                  {translatedSegment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
