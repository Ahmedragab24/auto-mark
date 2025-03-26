import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormData } from "@/schemas";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface EmailInputProps {
  form: UseFormReturn<RegisterFormData>;
}

export function EmailInput({ form }: EmailInputProps) {
  const { language } = useAppSelector((state: RootState) => state.Language);

  const texts = {
    ar: { label: "البريد الإلكتروني", placeholder: "example@gmail.com" },
    en: { label: "Email", placeholder: "example@gmail.com" },
  };

  const t = texts[language] || texts.ar;

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-right !text-bodyS font-regular">
            {t.label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="email"
                className={`pl-10 pr-10 h-11 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
                placeholder={t.placeholder}
                {...field}
              />
              <Mail
                className={`absolute w-5 h-5 text-gray-500 -translate-y-1/2 top-1/2 ${
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
