"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

import { type AddAddressFormData, addAddressSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { PhoneNumberField } from "./PhoneNumberInput";
import { useCountriesData } from "@/hooks/use-countriesData";
import { useCitiesData } from "@/hooks/use-citiesData";
import type { cityType, countryType } from "@/types";
import { setCountry } from "@/store/features/country";
import { Address, setAddress } from "@/store/features/Addrees";

const translate = {
  ar: {
    dir: "rtl",
    country: "الدولة",
    selectCountry: "اختر الدولة",
    city: "المدينة",
    selectCity: "اختر المدينة",
    countryCode: "الرقم البطاقة البريدية",
    address: "العنوان",
    enterAddress: "25 شارع حسين الشحات المتفرع من كايرو",
    phoneNumber: "رقم الهاتف",
    save: "حفظ التغييرات",
    back: "العودة",
  },
  en: {
    dir: "ltr",
    country: "Country",
    selectCountry: "Select Country",
    city: "City",
    selectCity: "Select City",
    countryCode: "Country Code",
    address: "Address",
    enterAddress: "25 Street Hassan Elshahat, nearby Kaira",
    phoneNumber: "Phone Number",
    save: "Save Changes",
    back: "Back",
  },
};

export default function AddressForm() {
  const [countryID, setCountryID] = useState<number | null>(null);
  const { user } = useAppSelector((state: RootState) => state.UserData);
  const { Countries } = useCountriesData();
  const { Cities } = useCitiesData();
  const Router = useRouter();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const t = translate[language];
  const [IsClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const numberWithoutCode = user?.phone?.replace(/^\+\d{1,2}/, "");

  const form = useForm<AddAddressFormData>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      country: "",
      city: "",
      iso_code: user?.country?.code,
      address: "",
      phone: numberWithoutCode,
    },
  });

  async function onSubmit(data: AddAddressFormData) {
    try {
      // Find the selected country and city to get their names in both languages
      const selectedCountryObj = Countries.find(
        (c: countryType) => c.name_en === data.country
      );
      const selectedCityObj = Cities?.find(
        (c: cityType) => c.name_en === data.city
      );

      // Create a properly formatted Address object
      const addressData: Address = {
        id: uuidv4(), // Generate a unique ID using timestamp
        country_en: selectedCountryObj?.name_en || "",
        country_ar: selectedCountryObj?.name_ar || "",
        city_en: selectedCityObj?.name_en || "",
        city_ar: selectedCityObj?.name_ar || "",
        address: data.address,
        iso_code: data.iso_code,
        phone: data.phone,
      };

      // Dispatch the properly formatted address
      dispatch(setAddress(addressData));
      Router.back();
    } catch (error) {
      console.error(error);
    }
  }

  if (!IsClient) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto p-6 bg-background rounded-xl py-20"
        dir={t.dir}
      >
        <div className="max-w-[90%] md:max-w-[60%] mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Country" : "الدولة"}
                    <span className="text-red-500 mr-1">*</span>
                  </FormLabel>
                  <Select
                    dir={language === "ar" ? "rtl" : "ltr"}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedCountry = Countries.find(
                        (country: countryType) => country.name_en === value
                      );
                      if (selectedCountry) {
                        dispatch(setCountry(selectedCountry));
                        setCountryID(selectedCountry.id);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            language === "en" ? "Select a country" : "اختر دولة"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Countries.map((country: countryType) => (
                        <SelectItem key={country.id} value={country.name_en}>
                          {language === "en"
                            ? country.name_en
                            : country.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "City" : "المدينة"}
                    <span className="text-red-500 mr-1">*</span>
                  </FormLabel>
                  <Select
                    dir={language === "ar" ? "rtl" : "ltr"}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!countryID}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            language === "en" ? "Select a city" : "اختر مدينة"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryID
                        ? Cities.map((city: cityType) => (
                            <SelectItem
                              key={city.id}
                              value={city.name_en ?? ""}
                            >
                              {language === "en" ? city.name_en : city.name_ar}
                            </SelectItem>
                          ))
                        : []}
                    </SelectContent>
                  </Select>
                  {!countryID && (
                    <FormMessage>
                      {language === "en"
                        ? "Please select a country first"
                        : "يرجى اختيار دولة اولا"}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* رقم الهاتف */}
            <PhoneNumberField control={form.control} className="mt-3" />

            {/* العنوان */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    {t.address}
                    <span className="text-red-500 mr-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.enterAddress}
                      className="text-right h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* الأزرار */}
          <div className="flex justify-between gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {t.save}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                form.reset();
                Router.back();
              }}
            >
              {t.back}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
