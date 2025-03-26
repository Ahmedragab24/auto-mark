"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { type SendCoderFormData, SendCoderSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ModelType } from "./LoginModel";
import { Form } from "../ui/form";
import { useForgotPasswordMutation } from "@/store/apis/Auth/Auth";
import { toast } from "@/hooks/use-toast";
import { ErrorType } from "@/types";
import { PhoneNumberField } from "../PhoneNumberInput";
import { Loader } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface ForgetPasswordProps {
  setTypeModel: (type: ModelType) => void;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ setTypeModel }) => {
  const [forgetPassword, { isLoading }] = useForgotPasswordMutation();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const texts = {
    ar: {
      successTitle: "تمت العملية بنجاح",
      successMessage: "تم إرسال كود التفعيل إلى رقم الهاتف المذكور",
      errorTitle: "خطأ",
      errorMessage: "حدث خطأ أثناء الإرسال",
      sendCode: "أرسل الكود",
      backToLogin: "العودة لتسجيل الدخول",
    },
    en: {
      successTitle: "Success",
      successMessage:
        "The activation code has been sent to the specified phone number",
      errorTitle: "Error",
      errorMessage: "An error occurred while sending",
      sendCode: "Send Code",
      backToLogin: "Back to Login",
    },
  };

  const t = texts[language] || texts.ar;

  const form = useForm<SendCoderFormData>({
    resolver: zodResolver(SendCoderSchema),
    defaultValues: {
      iso_code: "+971",
      phone: "",
    },
  });

  const onSubmit = useCallback(
    async (data: SendCoderFormData) => {
      setIsSubmitting(true);
      const formData = { phone: data.iso_code + data.phone };

      try {
        await forgetPassword(formData).unwrap();
        localStorage.setItem("phoneNumber", formData.phone);

        toast({
          title: t.successTitle,
          description: t.successMessage,
        });

        setTimeout(() => setTypeModel("OTP"), 1000);
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: t.errorTitle,
          description: JSON.stringify(error?.data?.message || t.errorMessage),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [forgetPassword, setTypeModel, t]
  );

  return (
    <div
      className="max-h-[80vh] flex items-center justify-center p-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="p-6 rounded-lg shadow-md w-full max-w-md ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <PhoneNumberField control={form.control} />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex gap-2 items-center justify-center">
                  <Loader className="animate-spin" />
                  <span>{t.sendCode}</span>
                </div>
              ) : (
                t.sendCode
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <Button
            variant="link"
            className="hover:underline"
            onClick={() => setTypeModel("Login")}
          >
            {t.backToLogin}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
