"use client";

import type { ErrorType, ProductType } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Loader, OctagonAlert, ShieldAlert } from "lucide-react";
import { useReportAdvertisementMutation } from "@/store/apis/advertisement";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import LoginModel from "./auth/LoginModel";

interface IProps {
  className?: string;
  product: ProductType;
}

const ReportAdBtn = ({ product, className }: IProps) => {
  const [ReportAd, { isLoading }] = useReportAdvertisementMutation();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { UserData } = useAppSelector((state: RootState) => state);
  const [reportText, setReportText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Set isClient on component mount, not dependent on language
  useEffect(() => {
    setIsClient(true);

    const user = UserData.token;
    setToken(user || null);
  }, [UserData.token]);

  const reportAdBtnClick = async () => {
    try {
      if (!reportText) {
        setValidationError(true);
        return;
      }

      if (!product.id) return;

      await ReportAd({ productID: product.id, reason: reportText }).unwrap();

      toast({
        title: language === "ar" ? "تم الابلاغ بنجاح" : "Reported successfully",
      });

      // Reset form and close dialog on success
      setReportText("");
      setOpen(false);
      setValidationError(false);
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          error?.data?.message ||
          (language === "ar"
            ? "حدث خطأ غير متوقع"
            : "An unexpected error occurred"),
        variant: "destructive",
      });
    }
  };

  if (!isClient) return null;

  return (
    <>
      {!token ? (
        <LoginModel>
          <Button
            variant="secondary"
            size="icon"
            className={`rounded-full ${className}`}
          >
            <ShieldAlert className="w-5 h-5" />
          </Button>
        </LoginModel>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className={`rounded-full ${className}`}
            >
              <ShieldAlert className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex flex-col gap-4 justify-center items-center">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {language === "ar" ? "ابلاغ" : "Report"}
                <OctagonAlert className="w-9 h-9 text-primary" />
              </DialogTitle>
              <DialogDescription className="text-lg">
                {language === "ar"
                  ? "ماهو سبب الإبلاغ ؟"
                  : "What is the reason for reporting?"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="w-full">
                <Textarea
                  id="report-reason"
                  className={`w-full md:w-[400px] h-[150px] resize-none p-6 ${
                    validationError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder={language === "ar" ? "نص الابلاغ" : "Report text"}
                  value={reportText}
                  onChange={(e) => {
                    setReportText(e.target.value);
                    if (validationError) setValidationError(false);
                  }}
                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">
                    {language === "ar"
                      ? "يرجى إدخال سبب الإبلاغ"
                      : "Please enter a reason for reporting"}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={reportAdBtnClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>
                      {language === "ar" ? "جاري الإرسال" : "Sending..."}
                    </span>
                  </div>
                ) : (
                  <span>{language === "ar" ? "إرسال" : "Send"}</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ReportAdBtn;
