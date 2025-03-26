"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, PasswordFormValues } from "@/schemas";
import { useChangePasswordMutation } from "@/store/apis/profile";
import { toast } from "@/hooks/use-toast";
import { ChangePasswordType, ErrorType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import CryptoJS from "crypto-js";

const translate = {
  ar: {
    dir: "rtl",
    title: "تعيين كلمة المرور",
    description: "الرجاء كتابة شيء تتذكره في المستقبل",
    old_password: "كلمة المرور القديمة",
    enter_old_password: "ادخل كلمة المرور",
    new_password: "كلمة المرور الجديدة",
    new_password_confirmation: "تأكيد كلمة المرور الجديدة",
    SuccessTitle: "نجاح",
    SuccessMessage: "تم تغيير كلمة المرور بنجاح",
    errorTitle: "خطأ",
    save: "حفظ التغييرات",
    back: "العودة",
  },
  en: {
    dir: "ltr",
    title: "Set Password",
    description: "Please enter something you remember in the future",
    old_password: "Old Password",
    enter_old_password: "Enter Password",
    new_password: "New Password",
    new_password_confirmation: "Confirm New Password",
    SuccessTitle: "Success",
    SuccessMessage: "Password changed successfully",
    errorTitle: "Error",
    save: "Save Changes",
    back: "Back",
  },
};

export default function PasswordForm() {
  const [ChangePasswordData] = useChangePasswordMutation();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const t = translate[language];
  const [IsClient, estIsClient] = useState(false);

  useEffect(() => {
    estIsClient(true);
  }, [language]);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const hashPassword = (password: string) =>
    CryptoJS.SHA256(password).toString();

  const onSubmit = useCallback(
    async (values: ChangePasswordType) => {
      try {
        const hashedOldPassword = hashPassword(values.old_password);
        const hashedPassword = hashPassword(values.new_password);
        const hashedPasswordConfirm = hashPassword(
          values.new_password_confirmation
        );
        const requestData = {
          old_password: hashedOldPassword,
          new_password: hashedPassword,
          new_password_confirmation: hashedPasswordConfirm,
        };
        await ChangePasswordData(requestData).unwrap();
        toast({
          title: t.SuccessTitle,
          description: t.SuccessMessage,
        });
        form.reset();
      } catch (err: unknown) {
        const error = err as ErrorType;
        const errorMessage = JSON.stringify(error?.data?.message);

        toast({
          title: t.errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [ChangePasswordData, form, t.SuccessMessage, t.SuccessTitle, t.errorTitle]
  );

  if (!IsClient) return null;

  return (
    <div className="py-10 bg-background rounded-xl">
      <Card className="w-full mx-auto max-w-[90%] md:max-w-[50%]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              dir="rtl"
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.old_password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder={t.enter_old_password}
                          className="h-12 pr-10"
                          {...field}
                        />
                        <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage
                      className={`${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.new_password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder={t.enter_old_password}
                          className="h-12 pr-10"
                          {...field}
                        />
                        <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage
                      className={`${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.new_password_confirmation}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          className="h-12 pr-10"
                          placeholder={t.enter_old_password}
                          {...field}
                        />
                        <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage
                      className={`${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t.save}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
