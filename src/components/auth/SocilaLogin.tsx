"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSocialRegisterMutation } from "@/store/apis/Auth/Auth";
import type { ErrorType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { setUserData } from "@/store/features/userData";
import { signInWithGoogle } from "@/hooks/use-firebase";

export default function SocialLoginButtons() {
  const [socialRegister, { isLoading }] = useSocialRegisterMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedLanguage = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const storeLanguage = isClient ? selectedLanguage : "ar";

  useEffect(() => {
    setLanguage(storeLanguage);
  }, [storeLanguage]);

  const messages = {
    success: {
      ar: { title: "العملية ناجحة", description: "تم تسجيل الدخول بنجاح 🎉" },
      en: { title: "Success", description: "Login successful 🎉" },
    },
    errors: {
      unexpected: {
        ar: "حدث خطأ غير متوقع",
        en: "An unexpected error occurred",
      },
      googleFail: {
        ar: "تعذر الحصول على بيانات المستخدم من Google.",
        en: "Failed to retrieve user data from Google.",
      },
    },
    button: {
      ar: "تسجيل الدخول باستخدام جوجل",
      en: "Sign in with Google",
    },
    loading: {
      ar: "جاري التحميل...",
      en: "Loading...",
    },
  };

  const handlerSocialRegister = async () => {
    if (isProcessing || isLoading) return;

    try {
      setIsProcessing(true);

      const loggedInUser = await signInWithGoogle();

      const userData = {
        name: loggedInUser.displayName,
        lang: language,
        fcm: "fsdf",
        type: "user",
        login_type: "google",
        email: loggedInUser.email || "",
        password: "social-register",
      };

      const response = await socialRegister(userData).unwrap();
      dispatch(setUserData(response));
      window.location.pathname = "/";

      toast({
        title: messages.success[language].title,
        description: messages.success[language].description,
      });
    } catch (err) {
      console.error("❌ خطأ في تسجيل الدخول:", err);

      const error = err as ErrorType;
      const message =
        error?.data?.message || messages.errors.unexpected[language];

      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Button
        variant="outline"
        className="justify-center w-full gap-2 !text-bodyS"
        type="button"
        onClick={handlerSocialRegister}
        disabled={isLoading || isProcessing}
      >
        {isProcessing || isLoading ? (
          messages.loading[language]
        ) : (
          <>
            <Image
              src="/Logo/Google logo.png"
              alt="google"
              width={20}
              height={20}
              className="w-4 h-4"
            />
            {messages.button[language]}
          </>
        )}
      </Button>
    </div>
  );
}
