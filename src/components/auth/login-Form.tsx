"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/schemas";
import type { ModelType } from "./LoginModel";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "./PasswordInput";
import { OrDivider } from "./OrDivider";
import { Loader } from "lucide-react";
import type { ErrorType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { useLoginMutation } from "@/store/apis/Auth/Auth";
import { PhoneNumberField } from "../PhoneNumberInput";
import CryptoJS from "crypto-js";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserData } from "@/store/features/userData";
import { RootState } from "@/store/store";
import SocialLoginButtons from "./SocilaLogin";
import { setPassword } from "@/store/features/password";

interface LoginFormProps {
  setTypeModel: (type: ModelType) => void;
  setIsOpen: (value: boolean) => void;
}

export default function LoginForm({ setTypeModel, setIsOpen }: LoginFormProps) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      iso_code: "+971",
      phone: "",
      password: "",
      fcm: "",
    },
  });
  const [loginForm, { isLoading }] = useLoginMutation();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  const onSubmit = useCallback(
    async (values: z.infer<typeof loginSchema>) => {
      try {
        const hashedPassword = hashPassword(values.password);
        const requestData = {
          phone: values.iso_code + values.phone,
          password: hashedPassword,
          fcm: values.fcm,
        };

        const loginData = await loginForm(requestData).unwrap();
        dispatch(setUserData(loginData));
        dispatch(setPassword({ password: hashedPassword }));
        setIsOpen(false);
        setTimeout(() => {
          window.location.pathname = "/";
        }, 2000);
        toast({
          title:
            language === "ar" ? "تم تسجيل الدخول بنجاح" : "Login Successful",
        });
      } catch (err: unknown) {
        console.error("Login error:", err);
        const error = err as ErrorType;
        const errorMessage = JSON.stringify(error?.data?.message);

        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [loginForm, setIsOpen, dispatch, language]
  );

  if (!isClient) return null;

  return (
    <div
      className="flex justify-center items-center px-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col w-full gap-3"
        >
          <PhoneNumberField control={form.control} />

          <PasswordInput form={form} />

          <div className="text-left">
            <Button
              variant="link"
              className="p-0 text-primary !text-bodyS"
              onClick={() => setTypeModel("ForgetPassword")}
            >
              {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {isLoading || form.formState.isSubmitting ? (
              <div className="flex justify-center gap-2 items-center">
                <Loader className="animate-spin mr-2" />
                <p>{language === "ar" ? "تحميل..." : "Loading..."}</p>
              </div>
            ) : (
              <p>{language === "ar" ? "تسجيل دخول" : "Login"}</p>
            )}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              className="h-auto p-0 text-gray-500"
              onClick={() => setTypeModel("TypeRegister")}
            >
              {language === "ar" ? "إنشاء حساب" : "Create an Account"}
            </Button>
          </div>

          <OrDivider />

          <SocialLoginButtons />
        </form>
      </Form>
    </div>
  );
}
