"use client";

import type React from "react";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader, User } from "lucide-react";
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
  ShowroomType,
} from "@/types";
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
import {
  updateShowroomSchema,
  type UpdateShowroomValues,
} from "@/schemas/upgrade";
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
import { setTypeRegister } from "@/store/features/typeRegister";
import { Card, CardContent } from "@/components/ui/card";
import { CategoriesData } from "@/constants";
import { setCountry } from "@/store/features/country";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  showroomDetails: ShowroomType;
}

const DialogUpdateShowroom = ({ open, setOpen, showroomDetails }: IProps) => {
  // State variables
  const [isClient, setIsClient] = useState(false);
  const [profileImageDragActive, setProfileImageDragActive] = useState(false);
  const [coverImageDragActive, setCoverImageDragActive] = useState(false);
  const [countryID, setCountryID] = useState<number | null>(null);
  const [cityID, setCityID] = useState<number | null>(null);
  const [categoryID, setCategoryID] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const dispatch = useAppDispatch();
  const [upgradeAccount, { isLoading }] = useUpgradeAccountMutation();

  // Fetch required data
  const { Countries } = useCountriesData();

  // Initialize state values from showroomDetails
  useEffect(() => {
    if (showroomDetails) {
      // Set country ID first
      if (showroomDetails.country?.id) {
        setCountryID(showroomDetails.country.id);
        dispatch(setCountry(showroomDetails.country));
      }

      // Set city ID
      if (showroomDetails.city?.id) {
        setCityID(showroomDetails.city.id);
      }

      // Set category ID (set to 0 if null to display "All")
      setCategoryID(showroomDetails.category_id || 0);

      // Reset hasChanges after initialization
      setHasChanges(false);
    }
  }, [showroomDetails, dispatch]);

  // Update the query to use the countryID state
  const {
    data: CitiesData,
    error: citiesError,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery(
    {
      countryID,
    },
    {
      skip: !countryID,
    }
  );

  // Find the category by ID
  const selectedCategory = useMemo(() => {
    if (
      showroomDetails?.category_id === 0 ||
      showroomDetails?.category_id === null
    ) {
      return { id: 0, name_en: "All", name_ar: "الكل", key: "all" };
    }
    return (
      CategoriesData.find((c) => c.id === showroomDetails?.category_id) || {
        id: 0,
        name_en: "All",
        name_ar: "الكل",
        key: "all",
      }
    );
  }, [showroomDetails?.category_id]);

  // Create form with proper default values
  const form = useForm<UpdateShowroomValues>({
    resolver: zodResolver(updateShowroomSchema),
    defaultValues: {
      logo: undefined,
      background_image: undefined,
      nameAr: showroomDetails?.setting?.showroom_ar || "",
      nameEn: showroomDetails?.setting?.showroom_en || "",
      description: showroomDetails?.info || "",
      country: showroomDetails?.country?.id?.toString(),
      city: showroomDetails?.city?.id?.toString(),
      specialization: selectedCategory?.name_en || "",
    },
  });

  // Set form values when showroomDetails changes
  useEffect(() => {
    if (showroomDetails) {
      // Set form values
      form.setValue("nameAr", showroomDetails?.setting?.showroom_ar || "");
      form.setValue("nameEn", showroomDetails?.setting?.showroom_en || "");
      form.setValue("description", showroomDetails.info || "");

      // Don't set the name values for country/city/specialization
      // The Select components will display the correct values based on the IDs
    }
  }, [showroomDetails, form]);

  // Handle hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // File upload handlers
  const handleProfileImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "يرجى اختيار ملف صورة صالح"
              : "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        form.setValue("logo", { file, preview });
        setHasChanges(true);
      };
      reader.onerror = () => {
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء قراءة الملف"
              : "An error occurred while reading the file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    },
    [form, language]
  );

  const handleCoverImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "يرجى اختيار ملف صورة صالح"
              : "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        form.setValue("background_image", { file, preview });
        setHasChanges(true);
      };
      reader.onerror = () => {
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء قراءة الملف"
              : "An error occurred while reading the file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    },
    [form, language]
  );

  // Memoize upload handlers to prevent recreating them on every render
  const profileImageUpload = useMemo(
    () => ({
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
    }),
    [profileImageDragActive, handleProfileImageFile]
  );

  const coverImageUpload = useMemo(
    () => ({
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
    }),
    [coverImageDragActive, handleCoverImageFile]
  );

  // Form submission handler
  const onSubmit = useCallback(
    async (data: UpdateShowroomValues) => {
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

        if (!data.nameAr || !data.nameEn) {
          toast({
            title: language === "ar" ? "خطأ" : "Error",
            description:
              language === "ar"
                ? "يرجى إدخال اسم المعرض باللغتين العربية والإنجليزية"
                : "Please enter showroom name in both Arabic and English",
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
        formData.append("category_id", String(categoryID));
        formData.append("package_id", "1");
        formData.append("showroom_ar", data.nameAr || "");
        formData.append("showroom_en", data.nameEn || "");
        if (data.description) {
          formData.append("info", data.description);
        }

        // Add showroom ID if available
        if (showroomDetails?.id) {
          formData.append("showroom_id", String(showroomDetails.id));
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

        if (result) {
          toast({
            title:
              language === "ar" ? "تم تحديث المعرض بنجاح" : "Showroom Updated",
            description:
              language === "ar"
                ? "تم تحديث بيانات المعرض بنجاح"
                : "Showroom information has been updated successfully.",
            variant: "default",
          });

          // Update user data in the store
          dispatch(setTypeRegister("showroom"));
          setOpen(false); // Close the dialog after successful update
          setHasChanges(false);
        }
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            error?.data?.message ||
            (language === "ar"
              ? "حدث خطأ أثناء تحديث المعرض"
              : "An error occurred while updating showroom"),
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
      showroomDetails?.id,
      setOpen,
    ]
  );

  if (!isClient) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-center text-primary">
            {language === "ar" ? "تعديل بيانات المعرض" : "Update Showroom Data"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {language === "ar"
              ? "قم بملء المعلومات التالية لتحديث بيانات المعرض"
              : "Please fill in the following information to update showroom details"}
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
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Profile Image */}
                  <Card className="overflow-hidden">
                    <CardContent className="flex flex-col p-4 gap-2 items-center">
                      <h3 className="text-sm font-medium">
                        {language === "en" ? "Profile Image" : "صورة الشعار"}
                      </h3>
                      <div
                        className="border h-44 rounded-full w-44 overflow-hidden"
                        onDragEnter={profileImageUpload.handleDrag}
                        onDragLeave={profileImageUpload.handleDrag}
                        onDragOver={profileImageUpload.handleDrag}
                        onDrop={profileImageUpload.handleDrop}
                      >
                        <Image
                          src={
                            form.watch("logo")?.preview ||
                            (showroomDetails?.setting?.logo
                              ? `${process.env.NEXT_PUBLIC_BASE_URL}${showroomDetails.setting.logo}`
                              : "/placeholder.svg")
                          }
                          alt="Profile"
                          width={176}
                          height={176}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="profile-image-upload"
                          className="text-primary text-xs cursor-pointer hover:text-primary/80"
                        >
                          {language === "ar" ? "تغيير الصورة" : "Change Image"}
                        </label>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={profileImageUpload.handleChange}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Cover Image */}
                  <Card className="overflow-hidden">
                    <CardContent className="flex flex-col p-4 gap-2 items-center">
                      <h3 className="text-sm font-medium">
                        {language === "ar" ? "صورة الغلاف" : "Cover Image"}
                      </h3>
                      <div
                        className="border h-44 rounded-lg w-full md:h-[220px] md:w-[380px] overflow-hidden relative"
                        onDragEnter={coverImageUpload.handleDrag}
                        onDragLeave={coverImageUpload.handleDrag}
                        onDragOver={coverImageUpload.handleDrag}
                        onDrop={coverImageUpload.handleDrop}
                      >
                        <Image
                          src={
                            form.watch("background_image")?.preview ||
                            (showroomDetails?.setting?.background_image
                              ? `${process.env.NEXT_PUBLIC_BASE_URL}${showroomDetails.setting.background_image}`
                              : "/placeholder.svg")
                          }
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="cover-image-upload"
                          className="text-primary text-xs cursor-pointer hover:text-primary/80"
                        >
                          {language === "ar" ? "تغيير الصورة" : "Change Image"}
                        </label>
                        <input
                          id="cover-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={coverImageUpload.handleChange}
                        />
                      </div>
                    </CardContent>
                  </Card>
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
                            <span className="text-red-500 mr-1">*</span>
                          </FormLabel>
                          <Select
                            dir="rtl"
                            value={String(countryID || "")}
                            onValueChange={(value) => {
                              const selectedCountry = Countries.find(
                                (country: countryType) =>
                                  country.id === Number(value)
                              );
                              if (selectedCountry) {
                                field.onChange(selectedCountry.name_en);
                                // dispatch(setCountry(selectedCountry));
                                setCountryID(selectedCountry.id);
                                // Reset city when country changes
                                setCityID(null);
                              }
                              setHasChanges(true);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue
                                  placeholder={
                                    language === "en"
                                      ? "Select a country"
                                      : "اختر دولة"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Countries.map((country: countryType) => (
                                <SelectItem
                                  key={country.id}
                                  value={String(country.id)}
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
                            value={String(cityID || "")}
                            onValueChange={(value) => {
                              const selectedCity =
                                CitiesData?.data?.cities?.find(
                                  (city: cityType) => city.id === Number(value)
                                );
                              if (selectedCity) {
                                field.onChange(selectedCity.name_en);
                                setCityID(selectedCity.id);
                              }
                              setHasChanges(true);
                            }}
                            disabled={!countryID || isCitiesLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue
                                  placeholder={
                                    language === "en"
                                      ? "Select a city"
                                      : "اختر مدينة"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CitiesData?.data?.cities?.map(
                                (city: cityType) => (
                                  <SelectItem
                                    key={city.id}
                                    value={String(city.id)}
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
                            value={String(categoryID)}
                            onValueChange={(value) => {
                              const id = Number(value);
                              const selectedCategory = CategoriesData.find(
                                (cat: CategoryCarsType) => cat.id === id
                              );
                              if (selectedCategory) {
                                field.onChange(selectedCategory.name_en);
                                setCategoryID(id);
                              }
                              setHasChanges(true);
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
                                    value={String(specialization.id)}
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
                              onChange={(e) => {
                                field.onChange(e);
                                setHasChanges(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex w-full gap-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOpen(false)}
                      disabled={isLoading}
                    >
                      {language === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !hasChanges}
                    >
                      {isLoading ? (
                        <div className="flex justify-center gap-2 items-center">
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>
                            {language === "ar"
                              ? "جاري التحميل..."
                              : "Loading..."}
                          </span>
                        </div>
                      ) : (
                        <span>
                          {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateShowroom;
