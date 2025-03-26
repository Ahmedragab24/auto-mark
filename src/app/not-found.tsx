"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function NotFound() {
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 mx-auto mt-16">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5 }}
          className="inline-block"
        >
          <Car className="text-primary mb-6 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">
          {language === "en" ? "Oops! Wrong Turn" : "عفوا! منعطف خاطئ"}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          {language === "en"
            ? "We couldn&apos;t find the page you&apos;re looking for. It seems you&apos;ve taken an unexpected detour."
            : "لم نتمكن من العثور على الصفحة التي تبحث عنها. يبدو أنك اتخذت طريقًا غير متوقع."}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xs sm:max-w-sm"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
        >
          {language === "en" ? "Back to Home" : "الرجوع للرئيسية"}
          <ArrowLeft className="mr-2" size={20} />
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm"
      >
        {language === "en"
          ? "Error 404 - Page Not Found"
          : "خطأ 404 - لم يتم العثور على الصفحة"}
      </motion.div>
    </div>
  );
}
