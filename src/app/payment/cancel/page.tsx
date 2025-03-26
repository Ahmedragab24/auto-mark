"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

export default function PaymentCancelPage() {
  const {
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const [IsClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!IsClient) return null;

  return (
    <div className="container max-w-[xl] h-screen mt-16 flex justify-center items-center">
      <Card className="border shadow-md py-6">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">
            {language === "en" ? "Payment Cancelled" : "الدفع ملغي"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Your payment process was cancelled."
              : "تم إلغاء عملية الدفع الخاصة بك."}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {language === "en"
              ? "If you experienced any issues during checkout, please contact our support team."
              : "اذا كان لديك اي مشكلة اثناء عملية الدفع، يرجى الاتصال بفريق الدعم الخاص بنا."}
          </p>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">
              {language === "en" ? "Go Home" : "الصفحة الرئيسية"}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/advertisement">
              {language === "en" ? "Try Again" : "حاول مرة اخرى"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
