"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { profileFormSchema, type ProfileFormValues } from "@/schemas";
import Link from "next/link";
import { PhoneNumberField } from "../PhoneNumberInput";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useCountriesData } from "@/hooks/use-countriesData";
import type {
  countryType,
  ErrorType,
  providerRegisterType,
  TypeRegister,
} from "@/types";
import { useUpdateProfileMutation } from "@/store/apis/profile";
import { toast } from "@/hooks/use-toast";

const translate = {
  ar: {
    nameLabel: "الاسم",
    namePlaceholder: "اسم المستخدم",
    countryLabel: "الدولة",
    countryPlaceholder: "اختر الدولة",
    emailLabel: "البريد الإلكتروني",
    saveChanges: "حفظ التغييرات",
    changePassword: "تغيير كلمة المرور",
    successTitle: "تم بنجاح",
    successMessage: "تم تحديث البيانات بنجاح",
    errorTitle: "خطأ",
    errorMessage: "حدث خطأ أثناء تحديث البيانات",
  },
  en: {
    nameLabel: "Name",
    namePlaceholder: "Username",
    countryLabel: "Country",
    countryPlaceholder: "Select a country",
    emailLabel: "Email",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    successTitle: "Success",
    successMessage: "Profile updated successfully",
    errorTitle: "Error",
    errorMessage: "An error occurred while updating the profile",
  },
};

export default function ProfileForm() {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { typeRegister } = useAppSelector(
    (state: RootState) => state.TypeRegister
  );
  const { user } = useAppSelector((state: RootState) => state.UserData);
  const [, setUserData] = useState(user);
  const { Countries: countriesList } = useCountriesData();
  const [updateProfile] = useUpdateProfileMutation();
  const [isClient, setIsClient] = useState(false);

  const numberWithoutCode = user?.phone?.replace(/^\+\d{1,2}/, "");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      iso_code: user.country?.code || "+971",
      phone: numberWithoutCode,
      login_type: "normal",
      type: typeRegister,
      country_id: user.country?.id || 1,
    },
  });

  useEffect(() => {
    if (user.name || user.email) {
      setUserData(user);
      form.reset({
        name: user.name,
        email: user.email || "",
        iso_code: user.country?.code || "+971",
        phone: numberWithoutCode,
        country_id: user.country?.id || 1,
        type: typeRegister,
        login_type: "normal",
      });
    }
  }, [user, form, typeRegister, numberWithoutCode]);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      try {
        const formData = {
          name: values.name,
          login_type: "normal" as providerRegisterType,
          email: values.email,
          phone: values.phone, // Remove the iso_code concatenation
          iso_code: values.iso_code,
          type: values.type as TypeRegister,
          country_id: values.country_id,
        };

        await updateProfile({ formData, lang: language }).unwrap();

        toast({
          title: translate[language].successTitle,
          description: translate[language].successMessage,
        });
        setTimeout(() => window.location.reload(), 2000);
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: translate[language].errorTitle,
          description: error?.data?.message || translate[language].errorMessage,
          variant: "destructive",
        });
      }
    },
    [updateProfile, language]
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full p-8 py-20 mx-auto bg-background rounded-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          dir={language === "ar" ? "rtl" : "ltr"}
          className="max-w-[90%] md:max-w-[70%] mx-auto space-y-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={language === "ar" ? "text-right" : "text-left"}
                  >
                    {translate[language].nameLabel} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`h-12 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      placeholder={translate[language].namePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={language === "ar" ? "text-right" : "text-left"}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate[language].countryLabel} *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={translate[language].countryPlaceholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countriesList.map((country: countryType) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {language === "ar"
                            ? country.name_ar
                            : country.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid items-center gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={language === "ar" ? "text-right" : "text-left"}
                  >
                    {translate[language].emailLabel}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={`h-12 pl-10 pr-10 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        {...field}
                      />
                      <Mail
                        className={`absolute top-1/2 translate-y-[-50%] h-5 w-5 text-gray-500 ${
                          language === "ar" ? "right-3" : "left-3"
                        }`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage
                    className={language === "ar" ? "text-right" : "text-left"}
                  />
                </FormItem>
              )}
            />

            <PhoneNumberField control={form.control} className="gap-4" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button type="submit" className="order-last w-full md:order-first">
              {translate[language].saveChanges}
            </Button>
            <Button type="button" variant="secondary" className="w-full">
              <Link href="/user/change-Password">
                {translate[language].changePassword}
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
