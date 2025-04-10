"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";

export default function AppDownloadSection() {
  const { language } = useAppSelector((state) => state.Language);
  const lang = language === "ar" ? "ar" : "en";
  const isRTL = lang === "ar";

  return (
    <div className="w-full container mx-auto mt-32 py-12 px-4">
      <div className="mb-8">
        <Breadcrumbs />
      </div>
      {/* Main heading */}
      <h2
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {isRTL ? "حمل التطبيق الان علي الهاتف" : "Download App Now"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Google Play Panel */}
        <div
          className="relative rounded-lg overflow-hidden pt-6 sm:pt-10 md:pt-16 px-3 sm:px-4 md:px-8 flex flex-col items-center"
          style={{
            background:
              "linear-gradient(220.32deg, #44B905 19.52%, #70E8F8 84.56%)",
          }}
        >
          {/* Background image */}
          <div className="absolute top-1/2 left-[28%] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[250px] sm:max-w-[450px] md:max-w-[550px] aspect-square opacity-5">
            <Image
              src="/Images/saxaa.png"
              alt="Google Play Background"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text content */}
          <div
            className={`relative z-10 w-full mb-2 sm:mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
              {isRTL ? "حمل التطبيق الان" : "Download App Now"}
            </h3>
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-4">
              {isRTL ? "على" : "on"}{" "}
              <span className="text-white">Google Play</span>
            </h3>
            <p className="text-white text-sm sm:text-base md:text-lg mb-2 sm:mb-4">
              {isRTL ? "حمل التطبيق الآن" : "Download app now"}
              <br />
              {isRTL ? "على جوجل بلاي" : "on Google Play"}
            </p>
          </div>

          {/* App store button and phone image */}
          <div className="relative z-10 w-full flex  justify-between items-center">
            {/* Download button */}
            <div className="flex flex-col sm:mt-[-3rem] md:mt-[-5rem] mb-4 sm:mb-0 z-20">
              <Link
                href="https://play.google.com/store/apps/details?id=com.secItDevelopers.auto_mark_app"
                className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1 sm:py-2 bg-white rounded-xl hover:scale-105 transition-all hover:opacity-80"
              >
                <div className="flex flex-col items-center gap-0 sm:gap-1">
                  <p className="text-gray-800 text-xs sm:text-sm">Get it on</p>
                  <h3 className="text-black text-sm sm:text-base font-medium">
                    Google Play
                  </h3>
                </div>

                <Image
                  src="/Logo/google_play.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
              </Link>
            </div>

            {/* Phone image */}
            <div className="relative w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] transform rotate-[10deg] mt-[-5rem] sm:mt-[-8rem] md:mt-[-12rem]">
              <Image
                src="/Images/iPhone 17.png"
                alt="Android App Screenshot"
                width={240}
                height={400}
                className="rounded-2xl sm:rounded-3xl w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Apple Store Panel */}
        <div
          className="relative rounded-lg overflow-hidden pt-6 sm:pt-10 md:pt-16 px-3 sm:px-4 md:px-8 flex flex-col items-center"
          style={{
            background:
              "linear-gradient(220.32deg, #000000 19.52%, #3E3B3B 84.56%)",
          }}
        >
          {/* Background image */}
          <div className="absolute top-1/2 left-[28%] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[250px] sm:max-w-[450px] md:max-w-[550px] aspect-square opacity-20">
            <Image
              src="/Images/saxaa.png"
              alt="Apple Store Background"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text content */}
          <div
            className={`relative z-10 w-full mb-2 sm:mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
              {isRTL ? "حمل التطبيق الان" : "Download App Now"}
            </h3>
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-4">
              {isRTL ? "على" : "on"}{" "}
              <span className="text-white">Apple Store</span>
            </h3>
            <p className="text-white text-sm sm:text-base md:text-lg mb-2 sm:mb-4">
              {isRTL ? "حمل التطبيق الآن" : "Download app now"}
              <br />
              {isRTL ? "على آب ستور" : "on Apple Store"}
            </p>
          </div>

          {/* App store button and phone image */}
          <div className="relative z-10 w-full flex justify-between items-center">
            {/* Download button */}
            <div className="flex flex-col sm:mt-[-3rem] md:mt-[-5rem] mb-4 sm:mb-0 z-20">
              <Link
                href="https://apps.apple.com/eg/app/automark-%D8%A7%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%B1%D9%83/id6473959588?l=ar"
                className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1 sm:py-2 bg-white rounded-xl hover:scale-105 transition-all hover:opacity-80"
              >
                <div className="flex flex-col items-center gap-0 sm:gap-1">
                  <p className="text-gray-800 text-xs sm:text-sm">
                    Download on the
                  </p>
                  <h3 className="text-black text-sm sm:text-base font-medium">
                    App Store
                  </h3>
                </div>

                <Image
                  src="/Logo/appleBlack.png"
                  alt="Download on the App Store"
                  width={500}
                  height={500}
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10"
                />
              </Link>
            </div>

            {/* Phone image */}
            <div className="relative w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] transform rotate-[10deg] mt-[-5rem] sm:mt-[-8rem] md:mt-[-12rem]">
              <Image
                src="/Images/iPhone 17.png"
                alt="iPhone App Screenshot"
                width={400}
                height={800}
                className="rounded-2xl sm:rounded-3xl w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
