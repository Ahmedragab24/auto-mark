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
import type { registerSchema } from "@/schemas";
import type { z } from "zod";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface PasswordInputProps {
  form: UseFormReturn<z.infer<typeof registerSchema>>;
  name: "password";
}

export function PasswordInputReg({ form, name }: PasswordInputProps) {
  const { language } = useAppSelector((state: RootState) => state.Language);

  const texts = {
    ar: { label: "كلمة المرور", placeholder: "كلمة المرور" },
    en: { label: "Password", placeholder: "Enter your password" },
  };

  const t = texts[language] || texts.ar;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem dir={language === "ar" ? "rtl" : "ltr"}>
          <FormLabel className="block text-right !text-bodyS font-regular">
            {t.label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className={`h-11 px-10 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
                placeholder={t.placeholder}
                {...field}
              />
              <Lock
                className={`absolute w-4 h-4 text-gray-500 -translate-y-1/2 top-1/2 ${
                  language === "ar" ? "right-3" : "left-3"
                }`}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
