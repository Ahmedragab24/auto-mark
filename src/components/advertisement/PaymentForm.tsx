"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CircleCheckBig, CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSubscriptionPackageMutation } from "@/store/apis/packages";

interface PackageType {
  id: number | string;
  price: number;
  duration_days: number | string;
  name?: string;
  description?: string;
}

interface PaymentFormProps {
  productId?: number | string;
  packageDetails: PackageType;
  newPrice: number;
  selectedPackage?: number | string;
  setIsDialogOpenOfPackage?: (isOpen: boolean) => void;
  isRTL?: boolean;
  userId: string | number;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
}

// Stripe wrapper component
export default function PaymentFormWrapper(props: PaymentFormProps) {
  // Make sure to use the environment variable correctly
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}

// Main payment form component
function PaymentForm({
  isRTL,
  productId,
  packageDetails,
  newPrice,
  selectedPackage,
  setIsDialogOpenOfPackage,
  userId,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [GetPackage] = useSubscriptionPackageMutation();

  async function onSubmit() {
    if (!selectedPackage) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "الرجاء اختيار باقة" : "Please select a package",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (newPrice >= 2) {
        // Create checkout session with enhanced metadata
        const response = await axios.post("/api/checkout", {
          // priceId: packageDetails.duration_days,
          amount: newPrice,
          currency: "AED",
          userId: userId,
          packageId: packageDetails.id,
          productId: productId || 0,
          packageName: packageDetails.name,
          packageDescription: packageDetails.description,
          duration_days: packageDetails.duration_days,
        });

        const { sessionId } = response.data;
        if (!sessionId) {
          throw new Error(
            isRTL ? "خطأ في إنشاء الجلسة" : "Error creating session"
          );
        }

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(sessionId);

          // Fetch subscription package details if it's a subscription package
        }

        // Load Stripe and redirect to checkout
        const stripeInstance = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );

        if (!stripeInstance) {
          throw new Error(
            isRTL ? "خطأ في تحميل Stripe" : "Error loading Stripe"
          );
        }

        const { error } = await stripeInstance.redirectToCheckout({
          sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }

        // Note: The code below will only execute if redirectToCheckout fails
        // as the user will be redirected to Stripe's checkout page
        if (setIsDialogOpenOfPackage) {
          setIsDialogOpenOfPackage(false);
        }
      } else {
        const formData = {
          packageId: Number(packageDetails.id),
          productId: Number(productId),
        };

        // Process the package since payment is already made
        await GetPackage(formData).unwrap();
        if (setIsDialogOpenOfPackage) {
          setIsDialogOpenOfPackage(false);
        }
        toast({
          title: isRTL ? "نجاح" : "Success",
          description: isRTL
            ? "تم تفعيل الباقة بنجاح"
            : "Package has been activated successfully",
          variant: "default",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Stripe Payment Error:", err);

      // Call onError callback if provided
      if (onError) {
        onError(err);
      }

      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL
          ? `حدث خطأ أثناء الدفع: ${err.message}`
          : `An error occurred during payment: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-center"
    >
      <Button
        variant="default"
        className="w-full mt-8"
        onClick={onSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : newPrice >= 2 ? (
          <CreditCard className="w-4 h-4 mr-2" />
        ) : (
          <CircleCheckBig className="w-4 h-4 mr-2" />
        )}
        <span>
          {isProcessing
            ? isRTL
              ? "جاري التحميل..."
              : "Processing..."
            : newPrice >= 2
            ? isRTL
              ? "متابعة الدفع بالبطاقة"
              : "Continue with Card"
            : isRTL
            ? "تفعيل الباقة"
            : "Activate Package"}
        </span>
      </Button>
    </motion.div>
  );
}
