"use client";

import type React from "react";
import CryptoJS from "crypto-js";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, Loader, Lock, Mail, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { CategoryCarsType, cityType, countryType } from "@/types";
import {
  useRegisterMutation,
  useSendCodeMutation,
} from "@/store/apis/Auth/Auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setUserData } from "@/store/features/userData";
import { useGetCitiesQuery } from "@/store/apis/countries&cities";
import { useCountriesData } from "@/hooks/use-countriesData";
import {
  registrationSchema,
  type RegistrationValues,
} from "@/schemas/exhibition";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCountry } from "@/store/features/country";
import type { ModelType } from "../auth/LoginModel";
import { PhoneNumberField } from "../PhoneNumberInput";
import { CategoriesData } from "@/constants";

interface Props {
  setTypeModel: (type: ModelType) => void;
}

export default function ExhibitionRegistrationForm({ setTypeModel }: Props) {
  // Make sure your useRegisterMutation is configured to accept FormData
  // If you need to modify the API configuration, you might need to update the Auth.ts file
  const [postRegister, { isLoading }] = useRegisterMutation();
  const [sendCode] = useSendCodeMutation();
  const {
    TypeRegister,
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const [countryID, setCountryID] = useState<number | null>(null);
  const [cityID, setCityID] = useState<number | null>(null);
  const [categoryID, setCategoryID] = useState<number | null>(null);

  const { Countries } = useCountriesData();
  const { data: CitiesData, error: citiesError } = useGetCitiesQuery(
    { countryID },
    { skip: !countryID }
  );
  const isCitiesLoading = !citiesError && !CitiesData && countryID !== null;
  const dispatch = useAppDispatch();

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      logo: undefined,
      background_image: undefined,
      name_en: "",
      name_ar: "",
      phone: "",
      iso_code: "+971",
      email: "",
      password: "",
      confirmPassword: "",
      description: "",
      country: "",
      city: "",
      specialization: "",
    },
  });

  const [profileImageDragActive, setProfileImageDragActive] = useState(false);
  const [coverImageDragActive, setCoverImageDragActive] = useState(false);

  const profileImageUpload = {
    dragActive: profileImageDragActive,
    handleDrag: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setProfileImageDragActive(true);
      } else if (e.type === "dragleave") {
        setProfileImageDragActive(false);
      }
    },
    handleDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setProfileImageDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleProfileImageFile(e.dataTransfer.files[0]);
      }
    },
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleProfileImageFile(e.target.files[0]);
      }
    },
  };

  const coverImageUpload = {
    dragActive: coverImageDragActive,
    handleDrag: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setCoverImageDragActive(true);
      } else if (e.type === "dragleave") {
        setCoverImageDragActive(false);
      }
    },
    handleDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCoverImageDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleCoverImageFile(e.dataTransfer.files[0]);
      }
    },
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleCoverImageFile(e.target.files[0]);
      }
    },
  };

  const handleProfileImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      form.setValue("logo", { file, preview });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      form.setValue("background_image", { file, preview });
    };
    reader.readAsDataURL(file);
  };

  const getLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
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
    async (data: RegistrationValues) => {
      try {
        const hashedPassword = hashPassword(data.password);
        const { latitude, longitude } = await getLocation();

        // Create a FormData object to properly handle file uploads
        const formData = new FormData();

        // Append all text fields to the FormData
        formData.append("name", data.name_en);
        formData.append("country_id", String(countryID));
        formData.append("city_id", String(cityID));
        formData.append("category_id", String(categoryID));
        formData.append("phone", data.iso_code + data.phone);
        formData.append("iso_code", data.iso_code);
        formData.append("email", data.email);
        formData.append("password", hashedPassword);
        formData.append("info", data.description || "");
        formData.append("login_type", "normal");
        formData.append("type", TypeRegister.typeRegister || "showroom");
        formData.append("longitude", String(longitude));
        formData.append("latitude", String(latitude));
        formData.append("fcm", "");
        formData.append("showroom_en", data.name_en);
        formData.append("showroom_ar", data.name_ar);
        formData.append("package_id", "1");

        // Append the image files to the FormData object
        if (data.logo?.file) {
          formData.append("logo", data.logo.file);
        }

        if (data.background_image?.file) {
          formData.append("background_image", data.background_image.file);
        }

        // Send the FormData to the server
        const result = await postRegister({
          formData,
          lang: language,
        }).unwrap();

        if (result) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(setUserData(data as any));

          await sendCode({
            phone: data.iso_code + data.phone,
            token: result.token,
          }).unwrap();

          toast({
            title: language === "en" ? "Code sent" : "تم إرسال الكود",
            description:
              language === "en"
                ? "Please check your WhatsApp"
                : "يرجى التحقق من رسالتك على الواتساب",
          });

          setTimeout(() => setTypeModel("OTP"), 2000);
          form.reset();
        }
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } };
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: error?.data?.message || "حدث خطأ",
          variant: "destructive",
        });
      }
    },
    [
      postRegister,
      dispatch,
      form,
      sendCode,
      setTypeModel,
      countryID,
      cityID,
      categoryID,
      TypeRegister,
      language,
    ]
  );

  return (
    <div className="flex items-center justify-center w-full lg:w-max mt-8">
      <ScrollArea className="w-full h-[65vh] px-3">
        <div className="flex justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center max-w-4xl gap-8 md:flex-row px-4"
              dir={language === "en" ? "ltr" : "rtl"}
            >
              <div className="flex flex-col flex-1 gap-6" dir="rtl">
                {/* Profile Image */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "en" ? "Profile Image" : "صورة الشعار"}
                        <span className="mr-1 text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <div
                            className={`relative flex items-center justify-center w-44 h-44 border-2 border-dashed rounded-full ${
                              profileImageUpload.dragActive
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                            onDragEnter={profileImageUpload.handleDrag}
                            onDragLeave={profileImageUpload.handleDrag}
                            onDragOver={profileImageUpload.handleDrag}
                            onDrop={profileImageUpload.handleDrop}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={profileImageUpload.handleChange}
                            />
                            {field.value?.preview ? (
                              <>
                                <Image
                                  src={
                                    field.value.preview || "/placeholder.svg"
                                  }
                                  alt="Profile"
                                  width={128}
                                  height={128}
                                  className="object-cover w-full h-full rounded-full"
                                />
                                {field.value?.preview && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="absolute w-5 h-5 p-0 rounded-full top-2 right-2"
                                    onClick={() =>
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      form.setValue("logo", null as any)
                                    }
                                  >
                                    x
                                  </Button>
                                )}
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                <ImagePlus className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          {!field.value?.preview && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="!text-bodyS"
                              onClick={() =>
                                (
                                  document.querySelector(
                                    'input[type="file"]'
                                  ) as HTMLInputElement
                                )?.click()
                              }
                            >
                              {language === "en" ? "Upload" : "رفع صورة"}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image */}
                <FormField
                  control={form.control}
                  name="background_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "en" ? "Cover Image" : "صورة الغلاف"}
                        <span className="mr-1 text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div
                          className={`relative flex h-[160px] w-[280px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors
                          ${
                            coverImageUpload.dragActive
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }
                        `}
                          onDragEnter={coverImageUpload.handleDrag}
                          onDragLeave={coverImageUpload.handleDrag}
                          onDragOver={coverImageUpload.handleDrag}
                          onDrop={coverImageUpload.handleDrop}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={coverImageUpload.handleChange}
                          />
                          {field.value?.preview ? (
                            <>
                              <Image
                                src={field.value.preview || "/placeholder.svg"}
                                alt="Cover"
                                fill
                                className="object-cover w-full h-full rounded-lg"
                              />
                              {field.value?.preview && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="absolute w-5 h-5 p-0 rounded-full top-2 right-2"
                                  onClick={() =>
                                    form.setValue(
                                      "background_image",
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      null as any
                                    )
                                  }
                                >
                                  x
                                </Button>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2 p-10 text-bodyS text-muted-foreground">
                              <ImagePlus className="w-8 h-8" />
                              <span>
                                {language === "en"
                                  ? "Upload an image or drag and drop it here"
                                  : "قم برفع صورة أو اسحبها هنا"}
                              </span>
                              <span className="text-xs">
                                {language === "en"
                                  ? "PNG, JPG, GIF up to 5MB"
                                  : "PNG, JPG, GIF حتى 5MB"}
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "en" ? "Description" : "وصف المعروض"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            language === "en"
                              ? "You can write information that will be displayed to users"
                              : "يمكنك كتابة معلومات عما يتم عرضه للمستخدمين"
                          }
                          className="resize-none w-full h-[115px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-6" dir="rtl">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Showroom Name  AR */}
                  <FormField
                    control={form.control}
                    name="name_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en"
                            ? "Showroom Name (Arabic)"
                            : " أسم المعرض (عربي)"}
                          <span className="mr-1 text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={
                                language === "en"
                                  ? "Showroom Name"
                                  : "اسم المعرض"
                              }
                              className="h-11 pr-10"
                              {...field}
                            />
                            <User className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* showroom Name  EN */}
                  <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en"
                            ? "Showroom Name (English)"
                            : " أسم المعرض (انجليزي)"}
                          <span className="mr-1 text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={
                                language === "en"
                                  ? "Showroom Name"
                                  : "اسم المعرض"
                              }
                              className="h-11 pr-10"
                              {...field}
                            />
                            <User className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en" ? "Country" : "الدولة"}{" "}
                          <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <Select
                          dir="rtl"
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedCountry = Countries.find(
                              (country: countryType) =>
                                country.name_en === value
                            );
                            if (selectedCountry) {
                              dispatch(setCountry(selectedCountry));
                              setCountryID(selectedCountry.id);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue
                                placeholder={
                                  language === "en"
                                    ? "Select a country"
                                    : "اختر الدولة"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Countries.map((country: countryType) => (
                              <SelectItem
                                key={country.id}
                                value={country.name_en}
                              >
                                {country.name_ar}
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
                          {language === "en" ? "City" : "المدينة"}{" "}
                          <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <Select
                          dir="rtl"
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedCity = CitiesData?.data?.cities?.find(
                              (city: cityType) => city.name_en === value
                            );
                            if (selectedCity) {
                              setCityID(selectedCity.id);
                            }
                          }}
                          disabled={!countryID || isCitiesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue
                                placeholder={
                                  language === "en"
                                    ? "Select a city"
                                    : "اختر المدينة"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CitiesData?.data?.cities?.map((city: cityType) => (
                              <SelectItem
                                key={city.id}
                                value={city.name_en || ""}
                              >
                                {city.name_ar}
                              </SelectItem>
                            )) || []}
                          </SelectContent>
                        </Select>
                        {!countryID && (
                          <FormMessage>عليك اختيار الدولة اولاً</FormMessage>
                        )}
                        {countryID && citiesError && (
                          <FormMessage>
                            فشل في تحميل المدن. يرجى المحاولة مرة أخرى.
                          </FormMessage>
                        )}
                        {isCitiesLoading && (
                          <FormMessage>جاري تحميل المدن...</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 justify-center items-center">
                  {/* Specialization */}
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en" ? "Specialization" : "التخصص"}
                          <span className="mr-1 text-primary">*</span>
                        </FormLabel>
                        <Select
                          dir="rtl"
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value) {
                              const selectedCategory = CategoriesData.find(
                                (cat: CategoryCarsType) => cat.name_en === value
                              );
                              if (selectedCategory) {
                                setCategoryID(selectedCategory.id);
                              }
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue
                                placeholder={
                                  language === "en"
                                    ? "Select a specialization"
                                    : "اختر التخصص"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CategoriesData.map(
                              (specialization: CategoryCarsType) => (
                                <SelectItem
                                  key={specialization.id}
                                  value={specialization.name_en || "all"}
                                >
                                  {language === "en"
                                    ? specialization.name_en
                                    : specialization.name_ar}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <PhoneNumberField control={form.control} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en" ? "Email" : "البريد الإلكتروني"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              dir="ltr"
                              className="h-11 pr-10 text-right"
                              {...field}
                            />
                            <Mail className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en" ? "Password" : "كلمة المرور"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              className="h-11 pr-10"
                              placeholder={
                                language === "en"
                                  ? "Enter your password"
                                  : "ادخل كلمة المرور"
                              }
                              {...field}
                            />
                            <Lock className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en"
                            ? "Confirm Password"
                            : "تأكيد كلمة المرور"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              className="h-11 pr-10"
                              placeholder={
                                language === "en"
                                  ? "Confirm your password"
                                  : "تأكيد كلمة المرور"
                              }
                              {...field}
                            />
                            <Lock className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex gap-2 items-center justify-center">
                      <Loader className="animate-spin" />
                      <span>
                        {language === "en" ? "Loading..." : "تحميل..."}
                      </span>
                    </div>
                  ) : language === "en" ? (
                    "Create Account"
                  ) : (
                    "إنشاء حساب"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
}
