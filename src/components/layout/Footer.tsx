"use client";

import Image from "next/image";
import Link from "next/link";
// import { Facebook, Linkedin, Twitter } from "lucide-react";
import {
  useGetInformationQuery,
  useVersionInfoQuery,
} from "@/store/apis/autoMarkInfo";
import type { AutoMarkInfoType, countryType, langType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setCountry } from "@/store/features/country";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCountriesData } from "@/hooks/use-countriesData";
import { FooterPoliciesLinks } from "@/constants";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data } = useGetInformationQuery("");
  const { Countries } = useCountriesData();
  const { data: versionInfo } = useVersionInfoQuery("countries");
  const AutoMarkVersion = versionInfo?.APP_VERSION;
  const AutoMarkInformation: AutoMarkInfoType = data?.setting;
  const [isClient, setIsClient] = useState(false);
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl");
  const [lang, setLang] = useState<langType>(language);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
    setDir(language === "ar" ? "rtl" : "ltr");
    setLang(language);
  }, [language]);

  if (!isClient) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: (dir: string) => ({
      opacity: 0,
      x: dir === "rtl" ? 20 : -20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const linkHoverVariants = {
    hover: {
      color: `var(--primary)`, // primary color
      x: dir === "rtl" ? -5 : 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.footer
      dir={dir}
      className="pt-16 pb-8 bg-secondary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* App Download Section */}
      <div className="container px-4 mx-auto mb-16">
        <motion.div
          className="p-8 shadow-sm bg-background rounded-2xl"
          variants={scaleVariants}
        >
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              className={`text-center ${
                lang === "ar" ? "md:text-right" : "md:text-left"
              }`}
              variants={fadeUpVariants}
            >
              <motion.h2
                className="mb-4 text-2xl font-bold md:text-3xl"
                variants={fadeUpVariants}
              >
                {lang === "ar"
                  ? "احصل على افضل الصفقات من خلال تطبيقنا"
                  : "Get the best deals with our app"}
              </motion.h2>
              <motion.p
                className="mb-8 font-semibold text-h4 text-primary"
                variants={fadeUpVariants}
              >
                {lang === "ar" ? "تحميل التطبيق الان" : "Download the app now"}
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center gap-4 md:justify-start"
                variants={containerVariants}
              >
                <motion.div
                  variants={itemVariants}
                  custom={dir}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="https://apps.apple.com/eg/app/automark-%D8%A7%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%B1%D9%83/id6473959588?l=ar"
                    className="flex items-center gap-4 px-4 py-2 bg-black rounded-xl transition-all dark:bg-secondary hover:opacity-80"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-gray-500">Download on the</p>
                      <h3 className="text-white text-h5">App Store</h3>
                    </div>

                    <Image
                      src="/Logo/ic_round-apple.png"
                      alt="Download on the App Store"
                      width={140}
                      height={42}
                      className="w-14 h-14"
                    />
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  custom={dir}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.secItDevelopers.auto_mark_app"
                    className="flex items-center gap-4 px-4 py-2 transition-all bg-black rounded-xl dark:bg-secondary hover:opacity-80"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-gray-500">Get it on</p>
                      <h3 className="text-white text-h5">Google Play</h3>
                    </div>

                    <Image
                      src="/Logo/google_play.png"
                      alt="Get it on Google Play"
                      width={140}
                      height={42}
                      className="w-14 h-14"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative h-[300px] md:h-[400px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 50,
                  damping: 20,
                },
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                },
              }}
            >
              <Image
                src="/Images/iPhone 15 Pro.png"
                alt="تطبيق اوتو مارك"
                fill
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer Links */}
      <motion.div
        className="container px-4 mx-auto"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo Section */}
          <motion.div
            className="flex flex-col items-center justify-center gap-6 text-center"
            variants={fadeUpVariants}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                },
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
            >
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_BASE_URL || "/placeholder.svg"}${
                    AutoMarkInformation?.logo
                  }` || "/Logo/logo.png"
                }
                alt="Auto Mark"
                width={200}
                height={150}
                className="w-24 h-16 mx-auto mb-2"
              />

              <motion.p
                className="text-gray-500"
                variants={itemVariants}
                custom={dir}
              >
                {AutoMarkVersion}
              </motion.p>
            </motion.div>

            <div className="flex justify-center gap-4 md:justify-start">
              <Link
                href={AutoMarkInformation?.linkedin || "#"}
                target="_blank"
                className="p-2 transition-colors bg-transparent border rounded-full border-primary hover:bg-primary/10"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </Link>

              <Link
                href={AutoMarkInformation?.facebook || "#"}
                target="_blank"
                className="p-2 transition-colors bg-transparent border rounded-full border-primary hover:bg-primary/10"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </Link>

              <Link
                href={AutoMarkInformation?.twitter || "#"}
                target="_blank"
                className="p-2 transition-colors bg-transparent border rounded-full border-primary hover:bg-primary/10"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </motion.div>

          {/* Countries Section */}
          <motion.div variants={fadeUpVariants}>
            <motion.h3
              className="mb-4 text-lg font-bold"
              variants={itemVariants}
              custom={dir}
            >
              {lang === "ar" ? "الدول" : "Countries"}
            </motion.h3>
            <motion.ul className="space-y-2" variants={containerVariants}>
              {Countries?.map((country: countryType, index: number) => (
                <motion.li
                  key={country.id}
                  onClick={() => dispatch(setCountry(country))}
                  variants={itemVariants}
                  custom={dir}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover="hover"
                >
                  <motion.div variants={linkHoverVariants}>
                    <Link
                      href={`/categories/car`}
                      className="text-gray-500 hover:text-primary"
                    >
                      {lang === "ar" ? country.name_ar : country.name_en}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Auto Mark Section */}
          <motion.div variants={fadeUpVariants}>
            <motion.h3
              className="mb-4 text-lg font-bold"
              variants={itemVariants}
              custom={dir}
            >
              {lang === "ar"
                ? AutoMarkInformation?.showroom_ar
                : AutoMarkInformation?.showroom_en}
            </motion.h3>
            <motion.ul className="space-y-2" variants={containerVariants}>
              {[
                { href: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
                {
                  href: "/categories",
                  label: lang === "ar" ? "الاقسام" : "Categories",
                },
                {
                  href: "/categories/showroom",
                  label: lang === "ar" ? "المعارض" : "Showrooms",
                },
                {
                  href: "/messages",
                  label: lang === "ar" ? "الرسائل" : "Messages",
                },
                {
                  href: "/notifications",
                  label: language === "ar" ? "الاشعارات" : "Notifications",
                },
                {
                  href: "/favorites",
                  label: lang === "ar" ? "المفضلة" : "Favorites",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  custom={dir}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover="hover"
                >
                  <motion.div variants={linkHoverVariants}>
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Policies Section */}
          <motion.div variants={fadeUpVariants}>
            <motion.h3
              className="mb-4 text-lg font-bold"
              variants={itemVariants}
              custom={dir}
            >
              {lang === "ar" ? "السياسات والقوانين" : "Policies and laws"}
            </motion.h3>
            <motion.ul className="space-y-2" variants={containerVariants}>
              {FooterPoliciesLinks.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  custom={dir}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover="hover"
                >
                  <motion.div variants={linkHoverVariants}>
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-primary"
                    >
                      {lang === "ar" ? item.label_ar : item.label_en}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="pt-8 text-center border-t border-gray-200 flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.5,
              duration: 0.5,
            },
          }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {lang === "ar"
              ? "جميع الحقوق محفوظة لاوتو مارك ©"
              : "All rights reserved to AutoMark ©"}
            {new Date().getFullYear()}
          </motion.p>
          <motion.a
            href="https://ahmed-elmadany.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {lang === "ar"
              ? "مطور الواجهة: Ahmed ElMadany"
              : "Interface Developer: Ahmed ElMadany"}
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
