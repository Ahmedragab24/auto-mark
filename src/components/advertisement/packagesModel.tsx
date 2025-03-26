"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import {
  useAddPackagesQuery,
  useApplyCouponMutation,
} from "@/store/apis/packages";
import {
  Check,
  Crown,
  Gem,
  Sparkles,
  Star,
  TicketPercent,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ErrorType, PackagesType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import PaymentFormWrapper from "./PaymentForm";

interface IProps {
  isDialogOpenOfPackage: boolean;
  setIsDialogOpenOfPackage: (value: boolean) => void;
  productId: number;
}

const PackagesModel = ({
  isDialogOpenOfPackage,
  setIsDialogOpenOfPackage,
  productId,
}: IProps) => {
  const {
    Language: { language },
    UserData: { user },
  } = useAppSelector((state: RootState) => state);
  const [Steps, setSteps] = useState({
    stepOne: true,
    stepTow: false,
    stepThree: false,
  });
  const { data, isLoading } = useAddPackagesQuery(language);
  const packages: PackagesType[] = data?.data?.packges || [];
  const [selectedPackage, setSelectedPackage] = useState<number>();
  const [PromoCode, setPromoCode] = useState<string>();
  const isRTL = language !== "en";
  const SelectedOnePackage = packages.find(
    (item) => item.id === selectedPackage
  );
  const [ApplyCoupon, { isLoading: isApplyingCoupon }] =
    useApplyCouponMutation();
  const [DiscountPrice, setDiscountPrice] = useState<number>(0);
  const [NewPrice, setNewPrice] = useState<number>(0);

  const handlerPackage = async (id: number) => {
    setSelectedPackage(id);
    setPromoCode(""); // Reset promo code when changing packages

    // Reset the price to the selected package price
    const selectedPack = packages.find((item) => item.id === id);
    if (selectedPack) {
      setNewPrice(Number(selectedPack.price) || 0);
      setDiscountPrice(0); // Reset discount percentage
    }
  };

  const CountnetSubscription = () => {
    if (!selectedPackage) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "الرجاء اختيار باقة" : "Please select a package",
        variant: "destructive",
      });
      return;
    }

    setSteps({
      stepOne: false,
      stepTow: true,
      stepThree: false,
    });
  };

  useEffect(() => {
    if (SelectedOnePackage) {
      setDiscountPrice(0); // Reset discount percentage when package changes
      setNewPrice(Number(SelectedOnePackage.price) || 0); // Set initial price
    }
  }, [SelectedOnePackage]);

  const applyPromoCode = async () => {
    if (!PromoCode || !selectedPackage) return;

    const formData = {
      packge_id: selectedPackage,
      code: PromoCode,
    };

    try {
      const result = await ApplyCoupon(formData).unwrap();

      // Set discount percentage
      setDiscountPrice(result.data?.precentage || 0);

      // Set final price after discount
      setNewPrice(result.data?.final_price || 0);

      toast({
        title: isRTL
          ? "تم تطبيق الكود بنجاح"
          : "Promo code applied successfully",
        description: isRTL
          ? "تم تطبيق كود الخصم على طلبك"
          : "The discount code has been applied to your order",
        variant: "default",
      });
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: isRTL ? "خطأ" : "Error",
        description:
          error?.data?.message || (isRTL ? "حدث خطأ" : "An error occurred"),
        variant: "destructive",
      });
    }
  };

  // Icons for different package tiers
  const packageIcons = [
    <Gem className="h-5 w-5" key="gem" />,
    <Star className="h-5 w-5" key="star" />,
    <Crown className="h-5 w-5" key="crown" />,
  ];

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex justify-center gap-2 items-center mb-6">
      {[1, 2, 3].map((step) => {
        const isActive =
          (step === 1 && Steps.stepOne) ||
          (step === 2 && Steps.stepTow) ||
          (step === 3 && Steps.stepThree);
        const isPast =
          (step === 1 && (Steps.stepTow || Steps.stepThree)) ||
          (step === 2 && Steps.stepThree);

        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary text-white"
                    : isPast
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-1 
                  ${isPast ? "bg-primary/20" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <AlertDialog
      open={isDialogOpenOfPackage}
      onOpenChange={setIsDialogOpenOfPackage}
    >
      <AlertDialogContent
        className={`sm:max-w-[650px] md:max-w-[700px] p-0 overflow-hidden rounded-xl ${
          isRTL ? "font-[system-ui]" : ""
        }`}
      >
        <div className="bg-gradient-to-r p-6 text-white from-primary/90 to-primary">
          <div className="flex justify-between items-center">
            <AlertDialogTitle className="flex m-0 text-2xl font-bold gap-2 items-center">
              <Sparkles className="h-6 text-yellow-300 w-6" />
              {Steps.stepOne &&
                (isRTL
                  ? "اختر باقتك المميزة!"
                  : "Choose Your Premium Package!")}
              {Steps.stepTow && (isRTL ? "ملخص الطلب" : "Order Summary")}
              {Steps.stepThree &&
                (isRTL ? "معلومات الدفع" : "Payment Information")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-white/90 mt-2">
            {Steps.stepOne &&
              (isRTL
                ? "ارتقِ بإعلاناتك واحصل على ميزات حصرية مع باقاتنا المميزة"
                : "Elevate your ads and unlock exclusive features with our premium packages")}
            {Steps.stepTow &&
              (isRTL
                ? "تمكين اعلانك والحصول على المميزات الخاصة بحسابك"
                : "Enable your ad and unlock exclusive features with your account")}
            {Steps.stepThree &&
              (isRTL
                ? "أكمل عملية الدفع لتفعيل باقتك"
                : "Complete payment to activate your package")}
          </AlertDialogDescription>
        </div>

        <div className="px-6">
          <StepIndicator />

          {isLoading ? (
            <div className="flex justify-center w-full items-center py-12">
              <div className="h-10 w-10 relative">
                <div className="border-4 border-primary/30 h-full rounded-full w-full absolute left-0 top-0"></div>
                <div className="border-4 border-primary border-t-transparent h-full rounded-full w-full absolute animate-spin left-0 top-0"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Package Selection */}
              {Steps.stepOne && (
                <ScrollArea className="h-[50vh] !flex !justify-center">
                  <div
                    className="grid grid-cols-1 gap-4 items-center md:grid-cols-2 mt-2 px-4 py-4"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {packages.map((pack, index) => (
                      <motion.div
                        key={pack.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-0 cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                          selectedPackage === pack.id
                            ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                            : "border hover:border-primary/50 hover:shadow-md"
                        }`}
                        onClick={() => handlerPackage(pack.id)}
                      >
                        {selectedPackage === pack.id && (
                          <div
                            className={`absolute top-3 bg-primary text-white rounded-full p-1 ${
                              isRTL ? "left-3" : "right-3"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex gap-2 items-center mb-2">
                            <div
                              className={`p-2 rounded-full ${
                                selectedPackage === pack.id
                                  ? "bg-primary text-white"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {packageIcons[index % packageIcons.length]}
                            </div>
                            <h3 className="text-lg font-bold">
                              {isRTL ? pack.name_ar : pack.name_en}
                            </h3>
                          </div>

                          <Badge
                            variant="outline"
                            className="bg-primary/5 border-primary/20 text-primary mb-3"
                          >
                            {pack.price} {isRTL ? "درهم" : "AED"}
                          </Badge>

                          <p className="text-muted-foreground text-sm">
                            {isRTL ? pack.description_ar : pack.description_en}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Step 2: Order Summary */}
              {Steps.stepTow && SelectedOnePackage && (
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="bg-muted/30 border-b p-4">
                        <h3 className="font-medium">
                          {isRTL ? "تفاصيل الباقة" : "Package Details"}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-3 items-center mb-3">
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                            {
                              packageIcons[
                                SelectedOnePackage.id % packageIcons.length
                              ]
                            }
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {isRTL
                                ? SelectedOnePackage.name_ar
                                : SelectedOnePackage.name_en}
                            </h4>
                            <Badge variant="outline" className="mt-1">
                              {SelectedOnePackage.price}{" "}
                              {isRTL ? "درهم" : "AED"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">
                          {isRTL
                            ? SelectedOnePackage.description_ar
                            : SelectedOnePackage.description_en}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="border rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="bg-muted/30 border-b p-4">
                        <h3 className="font-medium">
                          {isRTL ? "كود الخصم" : "Promo Code"}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <div className="flex-1 relative">
                            <Input
                              type="text"
                              placeholder={
                                isRTL ? "أدخل كود الخصم" : "Enter promo code"
                              }
                              className={`h-12 ${
                                isRTL ? "text-right pr-10 pl-4" : "pl-10 pr-4"
                              }`}
                              value={PromoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <div
                              className={`absolute top-1/2 transform -translate-y-1/2 ${
                                isRTL ? "right-3" : "left-3"
                              }`}
                            >
                              <TicketPercent className="h-5 text-muted-foreground w-5" />
                            </div>
                          </div>
                          <Button
                            onClick={applyPromoCode}
                            disabled={!PromoCode || isApplyingCoupon}
                            className="h-12 min-w-[120px]"
                          >
                            {isApplyingCoupon
                              ? isRTL
                                ? "جاري التطبيق..."
                                : "Applying..."
                              : isRTL
                              ? "تطبيق"
                              : "Apply"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="bg-muted/30 border-b p-4">
                        <h3 className="font-medium">
                          {isRTL ? "ملخص الدفع" : "Payment Summary"}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {isRTL ? "سعر الباقة" : "Package Price"}
                          </span>
                          <span>
                            {SelectedOnePackage.price} {isRTL ? "درهم" : "AED"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {isRTL ? "الخصم" : "Discount"}
                          </span>
                          <span>{DiscountPrice || 0} %</span>
                        </div>
                        <div className="border-t mt-3 pt-3">
                          <div className="flex justify-between font-medium items-center">
                            <span>{isRTL ? "الإجمالي" : "Total"}</span>
                            <span className="text-lg text-primary font-bold">
                              {NewPrice || SelectedOnePackage.price}{" "}
                              {isRTL ? "درهم" : "AED"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </ScrollArea>
              )}

              {/* Step 3: Payment Form */}
              {Steps.stepThree && (
                <ScrollArea className="h-[20vh] pr-4">
                  {selectedPackage && (
                    <PaymentFormWrapper
                      userId={user?.id ?? 0}
                      isRTL={isRTL}
                      productId={productId}
                      packageDetails={{
                        id: selectedPackage,
                        price: Number(
                          (
                            packages.find(
                              (item) => item.id === selectedPackage
                            ) ?? packages[0]
                          ).price
                        ),
                        duration_days: (
                          packages.find(
                            (item) => item.id === selectedPackage
                          ) ?? packages[0]
                        ).duration_days,
                        name: isRTL
                          ? (
                              packages.find(
                                (item) => item.id === selectedPackage
                              ) ?? packages[0]
                            ).name_ar
                          : (
                              packages.find(
                                (item) => item.id === selectedPackage
                              ) ?? packages[0]
                            ).name_en,
                        description: isRTL
                          ? (
                              packages.find(
                                (item) => item.id === selectedPackage
                              ) ?? packages[0]
                            ).description_ar
                          : (
                              packages.find(
                                (item) => item.id === selectedPackage
                              ) ?? packages[0]
                            ).description_en,
                      }}
                      newPrice={
                        NewPrice ||
                        Number(
                          (
                            packages.find(
                              (item) => item.id === selectedPackage
                            ) ?? packages[0]
                          ).price
                        )
                      }
                      selectedPackage={selectedPackage}
                      setIsDialogOpenOfPackage={setIsDialogOpenOfPackage}
                    />
                  )}
                </ScrollArea>
              )}
            </>
          )}
        </div>

        <AlertDialogFooter className="flex flex-col p-6 gap-2 pt-0 sm:flex-row">
          {Steps.stepOne && (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpenOfPackage(false)}
                className={`w-full sm:w-auto ${isRTL ? "order-2" : ""}`}
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={CountnetSubscription}
                disabled={!selectedPackage}
                className={`w-full sm:w-auto ${isRTL ? "order-1" : ""}`}
              >
                {isRTL ? "استمرار" : "Continue"}
              </Button>
            </>
          )}

          {Steps.stepTow && (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpenOfPackage(false)}
                className={`w-full sm:w-auto ${isRTL ? "order-3" : ""}`}
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setSteps({
                    stepOne: true,
                    stepTow: false,
                    stepThree: false,
                  })
                }
                className={`w-full sm:w-auto ${isRTL ? "order-2" : ""}`}
              >
                {isRTL ? (
                  <span className="flex gap-1 items-center">عودة</span>
                ) : (
                  <span className="flex gap-1 items-center">Back</span>
                )}
              </Button>
              <Button
                onClick={() =>
                  setSteps({
                    stepOne: false,
                    stepTow: false,
                    stepThree: true,
                  })
                }
                disabled={!selectedPackage}
                className={`w-full sm:w-auto ${isRTL ? "order-1" : ""}`}
              >
                {isRTL ? (
                  <span className="flex gap-1 items-center">متابعة للدفع</span>
                ) : (
                  <span className="flex gap-1 items-center">
                    Continue to Payment
                  </span>
                )}
              </Button>
            </>
          )}

          {Steps.stepThree && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  setSteps({
                    stepOne: false,
                    stepTow: true,
                    stepThree: false,
                  })
                }
                className="w-full sm:w-auto"
              >
                {isRTL ? (
                  <span className="flex gap-1 items-center">
                    <ArrowRight className="h-4 w-4" />
                    عودة
                  </span>
                ) : (
                  <span className="flex gap-1 items-center">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </span>
                )}
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PackagesModel;
