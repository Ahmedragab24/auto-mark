import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="container p-4 py-10 mx-auto flex flex-col gap-10 mt-36">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-12">
        {/* Standard Plan */}
        <Card className="text-white gradient-red rounded-3xl w-[350px] h-[480px] flex flex-col gap-8">
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
        </Card>

        {/* <PaymentForm /> */}
      </div>
    </div>
  );
};

export default page;
