"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordOTPSchema, PasswordFormOTPValues } from "@/schemas";
import { useResetPasswordMutation } from "@/store/apis/Auth/Auth";
import { ErrorType, UserTokenType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ModelType } from "./LoginModel";

interface IProps {
  setTypeModel: (type: ModelType) => void;
}

export default function PasswordOTPForm({ setTypeModel }: IProps) {
  const [ChangePassword] = useResetPasswordMutation();
  const form = useForm<PasswordFormOTPValues>({
    resolver: zodResolver(changePasswordOTPSchema),
    defaultValues: {
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const getUserData = (): UserTokenType | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userDataAutoMarkToken");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
    return null;
  };

  const user = getUserData();
  const token = user?.token;

  function onSubmit(data: PasswordFormOTPValues) {
    try {
      ChangePassword({ data, token }).unwrap();
      setTypeModel("Login");
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: "خطأ",
        description: JSON.stringify(error?.data?.message || "حدث خطأ"),
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            dir="rtl"
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">
                    كلمة المرور الجديدة
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="يجب ان تكون كلمة المرور أكثر من 8 احرف"
                        className="h-10 pr-10 text-right"
                        {...field}
                      />
                      <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">
                    تأكيد كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        className="h-10 pr-10 text-right"
                        placeholder="ادخل كلمة المرور"
                        {...field}
                      />
                      <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              تأكيد كلمة المرور
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
