"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImagePlus, Loader, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { useUpgradeAccountMutation } from "@/store/apis/upgrade";
import { toast } from "@/hooks/use-toast";
import type {
  CategoryCarsType,
  cityType,
  countryType,
  ErrorType,
} from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { upgradeSchema, type UpgradeValues } from "@/schemas/upgrade";
import { useCountriesData } from "@/hooks/use-countriesData";
import { useGetCitiesQuery } from "@/store/apis/countries&cities";
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
import { setTypeRegister } from "@/store/features/typeRegister";
import { useLoginMutation } from "@/store/apis/Auth/Auth";
import { setUserData } from "@/store/features/userData";
import { CategoriesData } from "@/constants";

interface IProps {
  open: boolean;
  changeOpen: (open: boolean) => void;
}

const DialogShowroomUpgrade = ({ open, changeOpen }: IProps) => {
  const {
    Language: { language },
    UserData: { user },
    Password: { password },
  } = useAppSelector((state: RootState) => state);
  const dispatch = useAppDispatch();
  const [upgradeAccount, { isLoading }] = useUpgradeAccountMutation();
  const [loginForm] = useLoginMutation();

  // State variables
  const [isClient, setIsClient] = useState(false);
  const [countryID, setCountryID] = useState<number | null>(null);
  const [cityID, setCityID] = useState<number | null>(null);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [profileImageDragActive, setProfileImageDragActive] = useState(false);
  const [coverImageDragActive, setCoverImageDragActive] = useState(false);

  // Fetch required data
  const { Countries } = useCountriesData();
  const { data: CitiesData, error: citiesError } = useGetCitiesQuery(
    { countryID },
    { skip: !countryID }
  );

  const isCitiesLoading = !citiesError && !CitiesData && countryID !== null;

  // Form setup
  const form = useForm<UpgradeValues>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: {
      logo: undefined,
      background_image: undefined,
      nameAr: "",
      nameEn: "",
      description: "",
      country: "",
      city: "",
      specialization: "",
    },
  });

  // Handle hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // File upload handlers
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

  // Form submission handler
  const onSubmit = useCallback(
    async (data: UpgradeValues) => {
      try {
        if (!countryID || !cityID) {
          toast({
            title: language === "ar" ? "خطأ" : "Error",
            description:
              language === "ar"
                ? "يرجى اختيار الدولة والمدينة"
                : "Please select country and city",
            variant: "destructive",
          });
          return;
        }

        // Create a FormData object to properly handle file uploads
        const formData = new FormData();

        // Append all form fields to the FormData
        formData.append("type", "showroom");
        formData.append("country_id", String(countryID));
        formData.append("city_id", String(cityID));
        if (categoryID) {
          formData.append("category_id", String(categoryID));
        }
        formData.append("package_id", "1");
        formData.append("showroom_ar", data.nameAr);
        formData.append("showroom_en", data.nameEn);
        if (data.description) {
          formData.append("info", data.description);
        }
        // Append the image files
        if (data.logo?.file) {
          formData.append("logo", data.logo.file);
        }
        if (data.background_image?.file) {
          formData.append("background_image", data.background_image.file);
        }

        const result = await upgradeAccount({
          formData,
          lang: language,
        }).unwrap();
        const requestData = {
          phone: user?.phone,
          password: password,
          fcm: user?.fcm,
        };

        const loginData = await loginForm(requestData).unwrap();
        dispatch(setUserData(loginData));

        if (result) {
          toast({
            title:
              language === "ar" ? "تم ترقية حسابك بنجاح" : "Account Upgraded",
            description:
              language === "ar"
                ? "تم تسجيلك كمعرض سيارات"
                : "You are registered as a car showroom.",
            variant: "default",
          });

          // Update user data in the store
          dispatch(setTypeRegister("showroom"));

          changeOpen(false);
        }
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            error?.data?.message ||
            (language === "ar"
              ? "حدث خطأ أثناء ترقية الحساب"
              : "An error occurred while upgrading account"),
          variant: "destructive",
        });
      }
    },
    [
      upgradeAccount,
      dispatch,
      language,
      countryID,
      cityID,
      categoryID,
      changeOpen,
      loginForm,
      password,
      user?.fcm,
      user?.phone,
    ]
  );

  // Clear file inputs
  const clearProfileImage = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("logo", null as any, { shouldValidate: true });
  };

  const clearCoverImage = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("background_image", null as any, { shouldValidate: true });
  };

  if (!isClient) return null;

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-center text-primary">
            {language === "ar" ? "ترقية الحساب" : "Upgrade Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {language === "ar"
              ? "قم بملء المعلومات التالية لترقية حسابك إلى معرض سيارات"
              : "Fill in the following information to upgrade your account to a car showroom"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full px-3">
          <div className="flex justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 items-center px-4"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex !flex-col !md:flex-row gap-6">
                  {/* Profile Image */}
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "en" ? "Profile Image" : "صورة الشعار"}
                          <span className="text-primary mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-3 items-center">
                            <div
                              className={`relative flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-full ${
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
                                className="absolute cursor-pointer inset-0 opacity-0"
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
                                    className="h-full rounded-full w-full object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-5 p-0 rounded-full w-5 -right-1 -top-1 absolute"
                                    onClick={clearProfileImage}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex flex-col justify-center text-muted-foreground text-sm gap-2 items-center">
                                  <ImagePlus className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                            {!field.value?.preview && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="text-sm"
                                onClick={() => {
                                  const input = document.querySelector(
                                    'input[type="file"]'
                                  ) as HTMLInputElement;
                                  if (input) input.click();
                                }}
                              >
                                {language === "en" ? "Add Image" : "إضافة صورة"}
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
                          {language === "ar" ? "صورة الغلاف" : "Cover Image"}
                          <span className="text-primary mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div
                            className={`relative flex h-[140px] w-auto md:w-[330px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors
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
                              className="absolute cursor-pointer inset-0 opacity-0"
                              onChange={coverImageUpload.handleChange}
                            />
                            {field.value?.preview ? (
                              <>
                                <Image
                                  src={
                                    field.value.preview || "/placeholder.svg"
                                  }
                                  alt="Cover"
                                  fill
                                  className="h-full rounded-lg w-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-5 p-0 rounded-full w-5 absolute right-2 top-2"
                                  onClick={clearCoverImage}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col p-6 text-muted-foreground text-sm gap-2 items-center">
                                <ImagePlus className="h-8 w-8" />
                                <span>
                                  {language === "en"
                                    ? "Drop files here or click to upload"
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
                </div>

                <div className="flex flex-col w-full gap-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Showroom Name (Arabic) */}
                    <FormField
                      control={form.control}
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === "en"
                              ? "Showroom Name (Arabic)"
                              : "اسم المعرض (عربي)"}
                            <span className="text-primary mr-1">*</span>
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
                              <User className="h-4 w-4 -translate-y-1/2 absolute right-3 top-1/2" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Showroom Name (English) */}
                    <FormField
                      control={form.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === "en"
                              ? "Showroom Name (English)"
                              : "اسم المعرض (انجليزي)"}
                            <span className="text-primary mr-1">*</span>
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
                                dir="ltr"
                                {...field}
                              />
                              <User className="h-4 w-4 -translate-y-1/2 absolute right-3 top-1/2" />
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
                            {language === "en" ? "Country" : "الدولة"}
                            <span className="text-primary mr-1">*</span>
                          </FormLabel>
                          <Select
                            dir={language === "ar" ? "rtl" : "ltr"}
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset city when country changes
                              setCityID(null);
                              form.setValue("city", "");

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
                            <span className="text-primary mr-1">*</span>
                          </FormLabel>
                          <Select
                            dir={language === "ar" ? "rtl" : "ltr"}
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedCity =
                                CitiesData?.data?.cities?.find(
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
                                    isCitiesLoading
                                      ? language === "en"
                                        ? "Loading cities..."
                                        : "جاري تحميل المدن..."
                                      : language === "en"
                                      ? "Select a city"
                                      : "اختر المدينة"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CitiesData?.data?.cities?.map(
                                (city: cityType) => (
                                  <SelectItem
                                    key={city.id}
                                    value={city.name_en || ""}
                                  >
                                    {language === "en"
                                      ? city.name_en
                                      : city.name_ar}
                                  </SelectItem>
                                )
                              ) || []}
                            </SelectContent>
                          </Select>
                          {!countryID && (
                            <p className="text-muted-foreground text-sm mt-1">
                              {language === "en"
                                ? "Select a country first"
                                : "اختر الدولة أولاً"}
                            </p>
                          )}
                          {countryID && citiesError && (
                            <FormMessage>
                              {language === "en"
                                ? "Error loading cities"
                                : "خطأ في تحميل المدن"}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid">
                    {/* Specialization */}
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === "en" ? "Specialization" : "التخصص"}
                            <span className="text-primary mr-1">*</span>
                          </FormLabel>
                          <Select
                            dir={language === "ar" ? "rtl" : "ltr"}
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value) {
                                const selectedCategory = CategoriesData.find(
                                  (cat: CategoryCarsType) =>
                                    cat.name_en === value
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
                  </div>

                  <div className="grid">
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === "en" ? "Description" : "وصف المعرض"}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                language === "en"
                                  ? "Description of your showroom"
                                  : "وصف المعرض الخاص بك"
                              }
                              className="min-h-[115px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex justify-center gap-2 items-center">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>
                          {language === "ar" ? "جاري التحميل..." : "Loading..."}
                        </span>
                      </div>
                    ) : (
                      <span>
                        {language === "ar" ? "ترقية الحساب" : "Upgrade Account"}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogShowroomUpgrade;
