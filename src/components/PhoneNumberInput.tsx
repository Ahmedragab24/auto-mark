"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { arabCountries } from "@/constants";
import type React from "react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

interface PhoneNumberFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  className?: string;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  control,
  className,
}) => {
  const hasPhoneError = !!control?._formState.errors?.phone;

  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const storeLanguageFromRedux = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const storeLanguage = isClient ? storeLanguageFromRedux : "ar";

  useEffect(() => {
    setLanguage(storeLanguage);
  }, [storeLanguage]);

  const labels = {
    phone: language === "ar" ? "رقم الهاتف" : "Phone Number",
    placeholder: language === "ar" ? "رقم الهاتف" : "Enter phone number",
  };

  if (!isClient) return null;

  return (
    <div
      className={`flex flex-col gap-3 ${
        hasPhoneError ? "mb-8" : ""
      } ${className}`}
    >
      <FormLabel
        htmlFor="phone"
        className={`text-bodyS !mb-[-8px] ${
          hasPhoneError ? "text-destructive" : ""
        }`}
      >
        {labels.phone}
      </FormLabel>
      <div className="relative w-full">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  className={`text-${
                    language === "ar" ? "right" : "left"
                  } pr-[130px] 
                    !border-input !ring-offset-background placeholder:text-muted-foreground 
                    focus-visible:!ring-ring focus-visible:!ring-2 h-11`}
                  placeholder={labels.placeholder}
                  {...field}
                  aria-invalid={hasPhoneError}
                  aria-describedby={hasPhoneError ? "phone-error" : undefined}
                />
              </FormControl>
              <FormMessage
                id="phone-error"
                className={`absolute  z-10 -bottom-6 text-bodyS text-destructive ${
                  language === "ar" ? "right-0" : "left-0"
                }`}
              />
            </FormItem>
          )}
        />
        <div className="absolute right-1 top-[50%] translate-y-[-50%]">
          <FormField
            control={control}
            name="iso_code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    dir={language === "ar" ? "rtl" : "ltr"}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="relative min-w-[110px] !border-none rounded-r-md focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {arabCountries.map((country) => (
                        <SelectItem key={country.code} value={country.dialCode}>
                          <div className="flex items-center gap-2 px-1">
                            <Image
                              src={country.flag || "/placeholder.svg"}
                              alt={country.name}
                              width={20}
                              height={20}
                              className="w-4 h-4 rounded-sm"
                            />
                            <span>{country.dialCode}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
