"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCountriesData } from "@/hooks/use-countriesData";
import { useGetCitiesQuery } from "@/store/apis/countries&cities";
import { formSchema, type FormValues } from "@/schemas/advertisement";
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
import { Switch } from "@/components/ui/switch";
import { PhoneNumberField } from "../PhoneNumberInput";
import { ImageUpload } from "@/components/ImageUpload";
import {
  setAddress,
  setCity,
  setCodeImages,
  setCountry,
  setFeatured,
  setIso_code,
  setLatitude,
  setLongitude,
  setName,
  setPhone,
  setWhatsappPreferred,
} from "@/store/features/AdAdvertisment";
import type { cityType, countryType, ErrorType } from "@/types";
import { useStoreImagesMutation } from "@/store/apis/advertisement";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { RootState } from "@/store/store";

interface IProps {
  setStepTwo: (value: boolean) => void;
}

const AddAdvertisementFormStepOne = ({ setStepTwo }: IProps) => {
  const [storeImages, { isLoading }] = useStoreImagesMutation();
  const [countryID, setCountryID] = useState<number | null>(null);
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { Countries } = useCountriesData();
  const { data: CitiesData, error: citiesError } = useGetCitiesQuery(
    {
      countryID,
    },
    {
      skip: !countryID,
    }
  );
  const isCitiesLoading = !citiesError && !CitiesData && countryID !== null;
  const dispatch = useAppDispatch();
  const [IsClient, setIsClient] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      iso_code: "+971",
      phone: "",
      address: "",
      mainImage: undefined,
      additionalImages: [],
      whatsappPreferred: false,
      featured: false,
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (countryID) {
      form.setValue("city", "");
    }
  }, [countryID, form]);

  const handleImageUpload = (
    files: File[],
    fieldName: "mainImage" | "additionalImages"
  ) => {
    if (fieldName === "mainImage" && files.length > 0) {
      form.setValue(fieldName, files[0]);
    } else if (fieldName === "additionalImages") {
      const currentImages = form.getValues("additionalImages") || [];
      const uniqueFiles = Array.from(
        new Set([...currentImages, ...files].map((file) => file.name))
      ).map((name) =>
        [...currentImages, ...files].find((file) => file.name === name)
      );
      const newImages = uniqueFiles
        .filter((file): file is File => file !== undefined)
        .slice(0, 20);
      form.setValue(fieldName, newImages);
    }
    form.trigger(fieldName);
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("المتصفح لا يدعم تحديد الموقع الجغرافي."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const formData = new FormData();
      // Add main image to both image and images[] array
      if (data.mainImage) {
        formData.append("image", data.mainImage);
        formData.append("images[]", data.mainImage);
      }

      // Add additional images
      if (Array.isArray(data.additionalImages)) {
        data.additionalImages.forEach((file) => {
          formData.append("images[]", file);
        });
      }

      try {
        const { latitude, longitude } = await getLocation();
        dispatch(setLatitude(latitude));
        dispatch(setLongitude(longitude));

        const result = await storeImages(formData).unwrap();
        const code = result.data.code;

        dispatch(setCodeImages(code));

        // Continue with the rest of the form submission
        dispatch(setName(data.name));
        dispatch(setPhone(data.phone));
        dispatch(setIso_code(data.iso_code));
        dispatch(setAddress(data.address));
        dispatch(setFeatured(data.featured));
        dispatch(setWhatsappPreferred(data.whatsappPreferred));
        const selectedCountry = Countries.find(
          (country: countryType) => country.name_en === data.country
        );
        if (selectedCountry) {
          dispatch(setCountry(selectedCountry));
        }
        const selectedCity = CitiesData?.data?.cities?.find(
          (city: cityType) => city.name_en === data.city
        );
        if (selectedCity) {
          dispatch(setCity(selectedCity));
        }
        setStepTwo(true);
      } catch (err: unknown) {
        const error = err as ErrorType;
        if (
          error?.data?.message ===
          "Failed to store images: Image source not readable"
        ) {
          toast({
            title:
              language === "en"
                ? "Error in image upload"
                : "خطأ في تحميل الصور",
            description:
              language === "en"
                ? "Failed to store images: Image source not readable"
                : "فشل في تخزين الصور: الصورة غير قابلة للقراءة",
            variant: "destructive",
          });
        } else {
          toast({
            title: language === "en" ? "Error" : "خطأ",
            description:
              error?.data?.message ||
              "حدث خطأ أثناء تحميل الصور. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          });
        }
      }
    },
    [
      dispatch,
      setStepTwo,
      Countries,
      CitiesData?.data?.cities,
      storeImages,
      language,
    ]
  );

  if (!IsClient) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:w-[80%] mx-auto space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 border border-border rounded-2xl p-8">
            <FormField
              control={form.control}
              name="mainImage"
              render={() => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "The Main Image" : "الصورة الرئيسية"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImagesUploaded={(files) =>
                        handleImageUpload(files, "mainImage")
                      }
                      subTitle={
                        language === "en"
                          ? "This image will appear on the advertisement card"
                          : "هذه الصورة ستظهر في بطاقة الاعلان"
                      }
                      maxFiles={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalImages"
              render={() => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Additional Images" : "صورة اضافية"}
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImagesUploaded={(files) =>
                        handleImageUpload(files, "additionalImages")
                      }
                      subTitle={
                        language === "en"
                          ? "You can add up to 20 additional images"
                          : "يمكنك إضافة حتى 20 صورة إضافية"
                      }
                      maxFiles={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 border border-border rounded-2xl p-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Name" : "ألاسم"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12"
                      placeholder={
                        language === "en"
                          ? "Enter your name/ exhibition"
                          : "ادخل اسمك/ المعرض"
                      }
                      {...field}
                      aria-label="Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhoneNumberField control={form.control} />

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
                    dir="rtl"
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
                    dir="rtl"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!countryID || isCitiesLoading}
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
                      {CitiesData?.data?.cities?.map((city: cityType) => (
                        <SelectItem key={city.id} value={city.name_en || ""}>
                          {language === "en" ? city.name_en : city.name_ar}
                        </SelectItem>
                      )) || []}
                    </SelectContent>
                  </Select>
                  {!countryID && (
                    <FormMessage>
                      {language === "en"
                        ? "Please select a country first"
                        : "يرجى اختيار دولة اولا"}
                    </FormMessage>
                  )}
                  {countryID && citiesError && (
                    <FormMessage>
                      {language === "en"
                        ? "Error loading cities"
                        : "خطاء في تحميل المدن"}
                    </FormMessage>
                  )}
                  {isCitiesLoading && (
                    <FormMessage>
                      {language === "en" ? "Loading" : "تحميل"}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en"
                      ? "Address in detail"
                      : "العنوان بالتفصيل"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        language === "en" ? "Enter the address" : "ادخل العنوان"
                      }
                      className="h-12"
                      {...field}
                      aria-label="Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappPreferred"
              render={({ field }) => (
                <div className="flex items-center justify-between space-x-2">
                  <span>
                    {language === "en"
                      ? "Prefer WhatsApp communication"
                      : "تفضيل التواصل بواتساب"}
                  </span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Prefer WhatsApp communication"
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <div className="flex items-center justify-between space-x-2">
                  <span>
                    {language === "en"
                      ? "Feature advertisement"
                      : "تمييز الاعلان"}
                  </span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Feature advertisement"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Button
            size="lg"
            type="submit"
            className="w-fit px-20"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span>{language === "en" ? "Loading" : "تحميل"}</span>
                <Loader className="animate-spin" />
              </div>
            ) : (
              <span>{language === "en" ? "Next" : "التالي"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddAdvertisementFormStepOne;
