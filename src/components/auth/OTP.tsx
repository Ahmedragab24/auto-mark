"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { type OTPFormValues, otpSchema } from "@/schemas";
import type { ModelType } from "./LoginModel";
import {
  useSendCodeMutation,
  useVerifyCodeMutation,
} from "@/store/apis/Auth/Auth";
import { toast } from "@/hooks/use-toast";
import type { ErrorType } from "@/types";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { getUserData } from "@/utils/userToken";
import { Loader } from "lucide-react";

interface OTPVerificationProps {
  setTypeModel: (type: ModelType) => void;
}

export default function OTPVerification({
  setTypeModel,
}: OTPVerificationProps) {
  const { UserData } = useAppSelector((state: RootState) => state);
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [verifyData] = useVerifyCodeMutation();
  const [sendCode] = useSendCodeMutation();

  const userPhone = localStorage.getItem("phoneNumber");
  const userToken = getUserData()?.token;

  const texts = {
    ar: {
      otpSent: "لقد أرسلنا رسالة قصيرة تحتوي على رمز التفعيل",
      phoneLabel: "على هاتفك",
      resend: "إرسال الكود مرة أخرى",
      verifying: "جاري التحقق...",
      confirm: "تأكيد",
      successTitle: "تم التحقق بنجاح",
      successMessage: "تم التحقق من الرمز بنجاح",
      resendSuccess: "تم إرسال الكود",
      resendMessage: "يرجى التحقق من رسالتك على الواتساب",
      errorTitle: "خطأ",
      errorMessage: "حدث خطأ أثناء التحقق من الرمز",
    },
    en: {
      otpSent: "We have sent a verification code",
      phoneLabel: "to your phone",
      resend: "Resend Code",
      verifying: "Verifying...",
      confirm: "Confirm",
      successTitle: "Verified Successfully",
      successMessage: "The code has been verified successfully",
      resendSuccess: "Code Sent",
      resendMessage: "Please check your WhatsApp message",
      errorTitle: "Error",
      errorMessage: "An error occurred while verifying the code",
    },
  };

  const t = texts[language] || texts.ar;

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: userPhone || "",
      key: "change_number",
      otp: "",
    },
  });

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    setCanResend(false);
    setTimer(20);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleResend = useCallback(async () => {
    if (canResend) {
      try {
        await sendCode({
          phone: userPhone || "",
          token: UserData.token,
        }).unwrap();
        toast({
          title: t.resendSuccess,
          description: t.resendMessage,
        });
        startTimer();
        form.reset({ otp: "" });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: t.errorTitle,
          description: error?.data?.message || t.errorMessage,
          variant: "destructive",
        });
      }
    }
  }, [canResend, sendCode, userPhone, UserData.token, startTimer, form, t]);

  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;
  };

  const onSubmit = useCallback(
    async (data: OTPFormValues) => {
      setIsVerifying(true);
      try {
        await verifyData({ data, token: UserData.token }).unwrap();
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });

        setTimeout(() => {
          setTypeModel(userToken ? "Login" : "ChangePassword");
        }, 1000);
      } catch (err) {
        const error = err as ErrorType;
        toast({
          title: t.errorTitle,
          description: error.data?.message || t.errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyData, UserData.token, userToken, setTypeModel, t]
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <p className="text-sm text-muted-foreground">
          {t.otpSent}
          <br />
          {t.phoneLabel}
          <span className="px-2 text-primary">{userPhone}</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2 flex flex-row-reverse justify-center items-center mx-auto">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 text-2xl"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="link"
                  className={`p-0 h-auto ${
                    !canResend
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary"
                  }`}
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  {canResend ? t.resend : formatTime(timer)}
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Loader className="animate-spin" />
                    <span>{t.verifying}</span>
                  </div>
                ) : (
                  t.confirm
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
