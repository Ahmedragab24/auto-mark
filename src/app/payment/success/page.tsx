"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSubscriptionPackageMutation } from "@/store/apis/packages";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [GetPackage] = useSubscriptionPackageMutation();
  const {
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const [IsClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("No session ID found");
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the payment status by checking with your backend
        const response = await axios.get(
          `/api/verify-payment?session_id=${sessionId}`
        );

        if (response.data.success) {
          setIsVerified(true);
          setSessionDetails(response.data.session);
        } else {
          setError(response.data.message || "Payment verification failed");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error verifying payment:", err);
        setError(err.message || "Failed to verify payment");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  // Separate useEffect to process the package once sessionDetails is available
  useEffect(() => {
    async function activatePackage() {
      if (!sessionDetails || !sessionDetails.packageId) return;

      try {
        const formData = {
          packageId: Number(sessionDetails.packageId),
          productId: Number(sessionDetails.productId),
        };

        // Process the package since payment is already made
        await GetPackage(formData).unwrap();

        toast({
          title: language === "ar" ? "نجاح" : "Success",
          description:
            language === "ar"
              ? "تم تفعيل الباقة بنجاح"
              : "Package has been activated successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Error activating package:", error);
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء تفعيل الباقة"
              : "An error occurred while activating the package",
          variant: "destructive",
        });
      }
    }

    if (sessionDetails && isVerified) {
      activatePackage();
    }
  }, [sessionDetails, isVerified, GetPackage, language]);

  if (!IsClient) return null;

  return (
    <div className="container max-w-xl h-screen mt-16 flex justify-center items-center">
      <Card className="border shadow-md py-8 px-10">
        <CardHeader className="text-center pb-4">
          {isVerifying ? (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
          ) : isVerified ? (
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-yellow-500" />
            </div>
          )}

          <CardTitle className="text-2xl">
            {isVerifying
              ? language === "en"
                ? '"Verifying Payment..."'
                : "جارى التحقق من الدفعة"
              : isVerified
              ? language === "en"
                ? "Payment Successful!"
                : "تم تفعيل الباقة بنجاح"
              : language === "en"
              ? '"Verifying Payment..."'
              : "جارى التحقق من الدفعة"}
          </CardTitle>
          <CardDescription>
            {isVerifying
              ? language === "en"
                ? "Please wait while we verify your payment."
                : "يرجى الانتظار حتى نتمكن من التحقق من الدفعة الخاصة بك."
              : isVerified
              ? language === "en"
                ? "Your payment has been processed successfully."
                : "تم تفعيل الباقة بنجاح."
              : error && language === "en"
              ? "Your payment is being processed. You will receive a confirmation shortly."
              : "يرجى الانتظار حتى نتمكن من التحقق من الدفعة الخاصة بك."}
          </CardDescription>
        </CardHeader>

        {isVerified && sessionDetails && (
          <CardContent className="text-center space-y-2">
            <p className="text-muted-foreground">
              {language === "en"
                ? "Thank you for your purchase. You will receive a confirmation email shortly."
                : "شكرًا لشرائك. ستصلك رسالة تأكيد قريبًا."}
            </p>
            {sessionDetails.amount_total && (
              <p className="font-medium">
                Amount: {(sessionDetails.amount_total / 100).toFixed(2)}{" "}
                {sessionDetails.currency?.toUpperCase() || "AED"}
              </p>
            )}
          </CardContent>
        )}

        <CardFooter className="flex justify-center pt-4">
          <Button asChild>
            <Link href="/">
              {language === "en" ? "Back to Home" : "العودة للرئيسية"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
