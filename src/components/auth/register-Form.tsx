"use client";

import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormData } from "@/schemas";
import type { ModelType } from "./LoginModel";
import { Form } from "@/components/ui/form";
import { NameInput } from "./NameInput";
import { EmailInput } from "./EmailInput";
import { PasswordInputReg } from "./PasswordInputReg";
import { ScrollArea } from "../ui/scroll-area";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorType, providerRegisterType, TypeRegister } from "@/types";
import {
  useRegisterMutation,
  useSendCodeMutation,
} from "@/store/apis/Auth/Auth";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { PhoneNumberField } from "../PhoneNumberInput";
import ErrorFallback from "@/errors/ErrorFallback";
import CryptoJS from "crypto-js";

interface RegisterFormProps {
  setTypeModel: (type: ModelType) => void;
}

export default React.memo(function RegisterForm({
  setTypeModel,
}: RegisterFormProps) {
  const [postRegister, { isLoading }] = useRegisterMutation();
  const [sendCode] = useSendCodeMutation();
  const { typeRegister } = useAppSelector(
    (state: RootState) => state.TypeRegister
  );
  const { language } = useAppSelector((state: RootState) => state.Language);

  const texts = {
    ar: {
      createAccount: "إنشاء حساب",
      alreadyUser: "أنت مستخدم بالفعل؟",
      login: "تسجيل دخول",
      loading: "تحميل...",
      codeSent: "تم إرسال الكود",
      checkWhatsApp: "يرجى التحقق من رسالتك على الواتساب",
      error: "خطأ",
    },
    en: {
      createAccount: "Create Account",
      alreadyUser: "Already a user?",
      login: "Login",
      loading: "Loading...",
      codeSent: "Code Sent",
      checkWhatsApp: "Please check your message on WhatsApp",
      error: "Error",
    },
  };

  const t = texts[language] || texts.ar;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      login_type: "normal",
      email: "",
      phone: "",
      password: "",
      iso_code: "+971",
      type: typeRegister,
    },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      type: typeRegister,
    });
  }, [typeRegister, form]);

  const hashPassword = (password: string) =>
    CryptoJS.SHA256(password).toString();

  const onSubmit = useCallback(
    async (values: RegisterFormData) => {
      try {
        const hashedPassword = hashPassword(values.password);
        const requestData = {
          name: values.name,
          login_type: "normal" as providerRegisterType,
          email: values.email,
          phone: values.iso_code + values.phone,
          password: hashedPassword,
          iso_code: values.iso_code,
          type: values.type as TypeRegister,
        };

        const formData = new FormData();
        Object.entries(requestData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        const result = await postRegister({
          lang: language,
          formData,
        }).unwrap();
        await sendCode({
          phone: requestData.phone,
          token: result.token,
        }).unwrap();

        toast({
          title: t.codeSent,
          description: t.checkWhatsApp,
        });

        setTimeout(() => setTypeModel("OTP"), 2000);
        form.reset();
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: t.error,
          description: JSON.stringify(error?.data?.message || "حدث خطأ"),
          variant: "destructive",
        });
      }
    },
    [postRegister, sendCode, setTypeModel, form, language, t]
  );

  return (
    <div className="md:mt-8 flex items-center justify-center w-full">
      <ScrollArea className="w-full h-[60vh] lg:h-[70vh] px-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-center w-full gap-3 md:gap-4 px-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <NameInput form={form} />
              <PhoneNumberField control={form.control} />
              <EmailInput form={form} />
              <PasswordInputReg form={form} name="password" />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Loader className="animate-spin" />
                    <span>{t.loading}</span>
                  </div>
                ) : (
                  t.createAccount
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-500">{t.alreadyUser}</span>
                <Button
                  variant="link"
                  className="hover:underline"
                  onClick={() => setTypeModel("Login")}
                >
                  {t.login}
                </Button>
              </div>
            </form>
          </Form>
        </ErrorBoundary>
      </ScrollArea>
    </div>
  );
});
