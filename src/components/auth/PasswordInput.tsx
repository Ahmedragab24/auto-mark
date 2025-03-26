"use client";

import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { loginSchema } from "@/schemas";
import type { z } from "zod";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface PasswordInputProps {
  form: UseFormReturn<z.infer<typeof loginSchema>>;
}

export function PasswordInput({ form }: PasswordInputProps) {
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState("ar");
  const storeLanguage = useAppSelector(
    (state: RootState) => state.Language.language
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setLanguage(storeLanguage);
    }
  }, [storeLanguage, isClient]);

  const labels = {
    password: language === "ar" ? "كلمة المرور" : "Password",
    placeholder: language === "ar" ? "كلمة المرور" : "Enter your password",
  };

  if (!isClient) return null;

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block !text-bodyS font-regular">
            {labels.password}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="password"
                className={`pr-10 h-11 text-${
                  language === "ar" ? "right" : "left"
                }`}
                placeholder={labels.placeholder}
                {...field}
              />
              <Lock className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 right-3 top-1/2" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
