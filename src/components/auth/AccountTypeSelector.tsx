"use client";

import type React from "react";
import { AlertTriangle, Lock, Store, User, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import DialgoVendorUpgrade from "../DialgoVendorUpgrade";
import DialogShowroomUpgrade from "../DialogShowroomUpgrade";
import DialgoUserUpgrade from "../DialgoUserUpgrade";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";

interface AccountTypeOption {
  id: string;
  title: string;
  title_ar: string;
  icon: React.ReactNode;
}

const accountTypes: AccountTypeOption[] = [
  {
    id: "user",
    title: "Normal User",
    title_ar: "مستخدم عادي",
    icon: <User className="!w-20 !h-20 text-gray-500" />,
  },
  {
    id: "vendor",
    title: "Car Dealer",
    title_ar: "تاجر سيارات",
    icon: <UsersRound className="!w-20 !h-20 text-gray-500" />,
  },
  {
    id: "showroom",
    title: "Car Showroom",
    title_ar: "معرض سيارات",
    icon: <Store className="!w-20 !h-20 text-gray-500" />,
  },
];

const formSchema = z.object({
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

export default function AccountTypeSelector() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  const {
    Language: { language },
    UserData: { user },
    Password: { password },
  } = useAppSelector((state: RootState) => state);
  const [isPassword, setIsPassword] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dialogOpenUser, setDialogOpenUser] = useState<boolean>(false);
  const [dialogOpenVendor, setDialogOpenVendor] = useState<boolean>(false);
  const [dialogOpenShowroom, setDialogOpenShowroom] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpgrade = (type: string) => {
    setSelectedType(type);

    if (type === "user") setDialogOpenUser(true);
    if (type === "vendor") setDialogOpenVendor(true);
    if (type === "showroom") setDialogOpenShowroom(true);
  };

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const hashedPassword = hashPassword(values.password);

    if (hashedPassword === password) {
      setIsPassword(true);
    } else {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description:
          language === "en"
            ? "The password is incorrect"
            : "كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  }

  if (!isClient) return null;

  return (
    <Card className="w-full p-6 py-20 mx-auto bg-background rounded-xl">
      <div
        className="max-w-[90%] lg:max-w-[80%] mx-auto flex flex-col gap-10"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {isPassword ? (
          <>
            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold">
                {language === "ar"
                  ? "✨ هل تريد ترقية حسابك؟"
                  : "✨ Do you want to upgrade your account?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "يمكنك التحول الان الى اي نوع من الحسابات والاستمتاع بمميزات خاصة."
                  : "You can upgrade to any type of account and enjoy special features."}
              </p>
            </div>

            {/* Account Type Selection */}
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
              {accountTypes
                .filter((type) => type.id !== user?.type)
                .map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    onClick={() => handleUpgrade(type.id)}
                    className={cn(
                      "relative w-auto h-auto rounded-2xl border-2 px-20 py-8 flex flex-col items-center justify-center gap-2 transition-all group",
                      selectedType === type.id
                        ? "border-primary bg-background text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {type.icon}
                    <span className="font-medium">
                      {language === "ar" ? type.title_ar : type.title}
                    </span>
                  </Button>
                ))}
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-2 p-4 text-sm rounded-lg bg-yellow-50 dark:bg-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-muted-foreground dark:text-muted-foreground">
                {language === "ar"
                  ? "المستخدم والتاجر ليس لهما نفس المحتوى (بروفايل). أما المعرض فله صفحة إعلانات مميزة."
                  : "The user and merchant do not have similar content (profiles). The showroom, however, has a unique advertisement page."}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-10">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold">
                {language === "ar" ? "كلمة المرور" : "Password"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "يرجى ادخال كلمة المرور الخاصة بك للتحقق من حسابك."
                  : "Please enter your password to verify your account."}
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block !text-bodyS font-regular">
                        {language === "ar" ? "كلمة المرور" : "Password"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            className={`md:w-[400px] pr-10 h-11 text-${
                              language === "ar" ? "right" : "left"
                            }`}
                            placeholder={
                              language === "ar"
                                ? "ادخل كلمة المرور"
                                : "Enter your password"
                            }
                            {...field}
                          />
                          <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4">
                  {language === "ar" ? "تأكيد" : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <DialgoUserUpgrade open={dialogOpenUser} changeOpen={setDialogOpenUser} />
      <DialgoVendorUpgrade
        open={dialogOpenVendor}
        changeOpen={setDialogOpenVendor}
      />
      <DialogShowroomUpgrade
        open={dialogOpenShowroom}
        changeOpen={setDialogOpenShowroom}
      />
    </Card>
  );
}
