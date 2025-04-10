"use client";

import { useAppSelector } from "@/store/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs ";

export default function AppDownloadSection() {
  const { language } = useAppSelector((state) => state.Language);
  const lang = language === "ar" ? "ar" : "en";
  const isRTL = lang === "ar";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 mt-32">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className={`text-3xl md:text-3xl lg:text-4xl font-bold mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL ? "حمل التطبيق الان علي الهاتف" : "Download Our App"}
          </h2>
          <p
            className={`text-muted-foreground text-lg ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL
              ? "احصل على تجربة أفضل مع تطبيقنا المتاح على متجر جوجل بلاي وآب ستور"
              : "Get a better experience with our app available on Google Play and App Store"}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Google Play Card */}
          <motion.div variants={item} className="h-full">
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardContent className="p-0 relative group h-full">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.secItDevelopers.auto_mark_app"
                  className="block relative h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/Images/Group 1597880455.png"
                    alt="Google Play"
                    width={500}
                    height={500}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                    <Download className="w-12 h-12 mb-3" />
                    <span className="text-xl font-medium">Google Play</span>
                    <div className="flex items-center mt-2">
                      <span className="mr-1">Download Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Apple Store Card */}
          <motion.div variants={item} className="h-full">
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardContent className="p-0 relative group h-full">
                <Link
                  href="https://apps.apple.com/eg/app/automark-%D8%A7%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%B1%D9%83/id6473959588?l=ar"
                  className="block relative h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/Images/Group 1597880456.png"
                    alt="Apple Store"
                    width={500}
                    height={500}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                    <Download className="w-12 h-12 mb-3" />
                    <span className="text-xl font-medium">App Store</span>
                    <div className="flex items-center mt-2">
                      <span className="mr-1">Download Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            {isRTL
              ? "استمتع بتجربة سلسة على جميع أجهزتك"
              : "Enjoy a seamless experience across all your devices"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
