"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import Link from "next/link";

export default function PricingCards() {
  return (
    <div
      dir="rtl"
      className="container flex flex-col gap-10 p-4 py-10 mx-auto mt-36"
    >
      <Breadcrumbs />

      <div className="grid grid-cols-1 gap-6 mx-auto md:grid-cols-2 xl:grid-cols-3">
        {/* Free Plan */}
        <Card className="flex flex-col justify-between bg-secondary rounded-3xl w-[350px] h-[480px]">
          <CardHeader className="pt-4 pb-8 space-y-4 text-right border-b border-border">
            <h3 className="text-lg font-medium">الشخصية</h3>
            <p className="text-sm text-gray-600">هذه افضل باقة للبداية </p>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">درهم</span>
              <div>
                <span className="mr-8 text-5xl font-bold">0</span>
                <span className="mr-1 text-sm text-gray-600">/ دائماً</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-6 h-6 p-1 border rounded-full shrink-0 border-primary" />
                    <span className="text-sm">
                      هذه الخاصية بكامل باقة البداية
                    </span>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-gray-700 bg-gray-200 hover:bg-gray-300">
              <Link href={"/advertisement/packages/payment"}>
                الباقة الحالية
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="text-white gradient-red rounded-3xl w-[350px] h-[480px] flex flex-col justify-between">
          <CardHeader className="pt-4 pb-8 space-y-4 text-right border-b border-border">
            <h3 className="text-lg font-medium">المميزة</h3>
            <p className="text-sm text-gray-300">هذه افضل باقة للبداية </p>
            <div className="flex flex-col">
              <span className="text-sm text-gray-300">درهم</span>
              <div>
                <span className="mr-8 text-5xl font-bold">99</span>
                <span className="mr-1 text-sm text-gray-300 ">/ 6أشهر</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-6 h-6 p-1 border rounded-full shrink-0 border-border" />
                    <span className="text-sm">
                      هذه الخاصية بكامل باقة البداية
                    </span>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gray-200 text-primary hover:bg-gray-300">
              <Link href={"/advertisement/packages/payment"}>أشترك</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Standard Plan */}
        <Card className="text-white gradient-red rounded-3xl w-[350px] h-[480px] flex flex-col justify-between">
          <CardHeader className="pt-4 pb-8 space-y-4 text-right border-b border-border">
            <h3 className="text-lg font-medium">العادية</h3>
            <p className="text-sm text-gray-300">هذه افضل باقة للبداية </p>
            <div className="flex flex-col">
              <span className="text-sm text-gray-300">درهم</span>
              <div>
                <span className="mr-8 text-5xl font-bold">150</span>
                <span className="mr-1 text-sm text-gray-300 ">/ 6أشهر</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-6 h-6 p-1 border rounded-full shrink-0 border-border" />
                    <span className="text-sm">
                      هذه الخاصية بكامل باقة البداية
                    </span>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gray-200 text-primary hover:bg-gray-300">
              <Link href={"/advertisement/packages/payment"}>أشترك</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
