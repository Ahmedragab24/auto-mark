"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrackFormSchema, type TrackFormValues } from "@/schemas/advertisement";
import { toast } from "@/hooks/use-toast";
import { useGetSuSectionsQuery } from "@/store/apis/attrbuite";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ErrorType, SubSectionsType } from "@/types";
import {
  colorName,
  condition,
  conditionPriceType,
  cylindersCount,
  enginCount,
  fuelNameType,
  horsePower,
  WarrantyType,
} from "@/constants";
import { useState } from "react";
import { useAddAdvertisementMutation } from "@/store/apis/advertisement";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const translations = {
  en: {
    subCategory: "Subcategory",
    selectSubSections: "Select Sub Sections",
    brand: "Brand",
    selectBrand: "Enter Brand",
    model: "Model",
    selectModel: "Enter Model",
    year: "Manufacturing Year",
    mileage: "Mileage",
    price: "Price",
    condition: "Condition",
    selectCondition: "Select Condition",
    exteriorColor: "Exterior Color",
    interiorColor: "Interior Color",
    fuelType: "Fuel Type",
    selectFuelType: "Select Fuel Type",
    cylindersCount: "Cylinders Count",
    selectCylindersCount: "Select Cylinders Count",
    horsePower: "Horse Power",
    selectHorsePower: "Select Horse Power",
    engineCount: "Engine Count",
    selectEnginCount: "Select Engine Count",
    theWeight: "Weight",
    enterTheWeight: "Enter Weight",
    selectExteriorColor: "Select Exterior Color",
    conditionPrice: "Advertisement type",
    selectConditionPrice: "Select Advertisement type",
    warranty: "Warranty",
    selectWarranty: "Select Warranty",
    description: "Description",
    enterDescription: "Enter Description",
    submit: "Submit",
    selectPlaceholder: "Select",
    required: "* Required",
    successTitle: "Advertisement added",
    successMessage: "Advertisement added successfully",
    errorMessage: "An error occurred",
    nextButtonTitle: "Next",
    backButtonTitle: "Back",
    loading: "Loading...",
  },
  ar: {
    subCategory: "القسم الفرعي",
    selectSubSections: "اختر القسم الفرعي",
    brand: "الماركة",
    selectBrand: "ادخل الماركة",
    model: "الموديل",
    selectModel: "ادخل الموديل",
    year: "سنة الصنع",
    mileage: "المسافة المقطوعة",
    price: "السعر",
    fuelType: "نوع الوقود",
    selectFuelType: "اختر نوع الوقود",
    cylindersCount: "عدد الاسطوانات",
    selectCylindersCount: "اختر عدد الاسطوانات",
    horsePower: "قوة الحصان",
    selectHorsePower: "اختر قوة الحصان",
    engineCount: "سعة المحرك (سي سي)",
    selectEnginCount: "اختر سعة المحرك",
    theWeight: "الوزن",
    enterTheWeight: "ادخل الوزن",
    condition: "الحالة",
    selectCondition: "اختر الحالة",
    conditionPrice: "نوع الاعلان",
    selectConditionPrice: "اختر نوع الاعلان",
    exteriorColor: "اللون الخارجي",
    interiorColor: "اللون الداخلي",
    selectExteriorColor: "اختر اللون",
    warranty: "الضمان",
    selectWarranty: "اختر الضمان",
    description: "الوصف",
    enterDescription: "ادخل وصف الإعلان هنا",
    submit: "إرسال",
    selectPlaceholder: "اختر",
    required: "* مطلوب",
    successTitle: "تم إضافة الإعلان",
    successMessage: "تمت إضافة الإعلان بنجاح",
    errorMessage: "حدث خطأ",
    nextButtonTitle: "التالي",
    backButtonTitle: "العودة",
    loading: "تحميل...",
  },
};

export default function AddAdTrackStepTow() {
  const [addAdvertisement, { isLoading }] = useAddAdvertisementMutation();
  const router = useRouter();
  const form = useForm<TrackFormValues>({
    resolver: zodResolver(TrackFormSchema),
    defaultValues: {
      Subsection: "",
      brand: "",
      model: "",
      manufacturingYear: "",
      mileage: "",
      price: "",
      fuelType: "",
      cylindersCount: "",
      horsePower: "",
      exteriorColor: "",
      interiorColor: "",
      engineCount: "",
      theWeight: "",
      condition: "",
      conditionPrice: "",
      Warranty: "",
      description: "",
    },
  });

  const [SubCategoryID, setSubCategoryID] = useState(0);
  const { Categories, Language, advertisement } = useAppSelector(
    (state: RootState) => state
  );
  const { data: subSectionsData } = useGetSuSectionsQuery({
    categoryID: Categories.Categories.id,
    lang: Language.language,
  });

  const SubSectionsData = subSectionsData?.data?.subcategories || [];
  const lang = Language.language;
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: TrackFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const advertisementStepOne = advertisement;
    const formData = {
      category_id: Categories.Categories.id,
      name: `${data.brand} ${data.model} ${data.manufacturingYear}`,
      phone: advertisementStepOne?.iso_code + advertisementStepOne?.phone,
      address: advertisementStepOne?.address,
      user_name: advertisementStepOne?.name,
      description_en: data.description,
      price: data.price,
      warranty: data.Warranty === "true" ? true : false,
      condition: "used", // ['new', 'used']
      motion_vector: "manual",
      whatsapp: advertisementStepOne?.whatsappPreferred,
      type: data.conditionPrice, //  ['Fixed Price', 'Negotiable', 'Installment'];
      longitude: String(advertisementStepOne?.longitude),
      latitude: String(advertisementStepOne?.latitude),
      code: advertisementStepOne?.codeImage,
      // brand_id: BrandID,
      // model_id: ModelID,
      sub_category_id: SubCategoryID,
      country_id: advertisementStepOne?.country?.id,
      city_id: advertisementStepOne?.city?.id,
      standard_specifications: [
        ...(data.manufacturingYear
          ? [
              {
                title_en: "Manufacturing Year",
                title_ar: "سنة الصنع",
                key: "manufacturing_year",
                value_ar: data.manufacturingYear,
                value_en: data.manufacturingYear,
              },
            ]
          : []),
        ...(data.mileage
          ? [
              {
                title_en: "Mileage",
                title_ar: "المسافة المقطوعة",
                key: "mileage",
                value_ar: data.mileage,
                value_en: data.mileage,
              },
            ]
          : []),
        ...(data.engineCount
          ? [
              {
                title_en: "Engine Capacity",
                title_ar: "سعة المحرك",
                key: "engine",
                value_ar:
                  enginCount.find((item) => item.name_en === data.engineCount)
                    ?.name_ar || data.engineCount,
                value_en:
                  enginCount.find((item) => item.name_ar === data.engineCount)
                    ?.name_en || data.engineCount,
              },
            ]
          : []),
        ...(data.cylindersCount
          ? [
              {
                title_en: "Number of Cylinders",
                title_ar: "عدد الأسطوانات",
                key: "cylinders",
                value_ar:
                  cylindersCount.find(
                    (item) => item.name_en === data.cylindersCount
                  )?.name_ar || data.cylindersCount,
                value_en:
                  cylindersCount.find(
                    (item) => item.name_ar === data.cylindersCount
                  )?.name_en || data.cylindersCount,
              },
            ]
          : []),
        ...(data.exteriorColor
          ? [
              {
                title_en: "Exterior Color",
                title_ar: "اللون الخارجي",
                key: "exterior_color",
                value_ar:
                  colorName.find((item) => item.name_en === data.exteriorColor)
                    ?.name_ar || data.exteriorColor,
                value_en:
                  colorName.find((item) => item.name_ar === data.exteriorColor)
                    ?.name_en || data.exteriorColor,
              },
            ]
          : []),
        ...(data.interiorColor
          ? [
              {
                title_en: "Interior Color",
                title_ar: "اللون الداحلي",
                key: "interior_color",
                value_ar:
                  colorName.find((item) => item.name_en === data.interiorColor)
                    ?.name_ar || data.interiorColor,
                value_en:
                  colorName.find((item) => item.name_ar === data.interiorColor)
                    ?.name_en || data.interiorColor,
              },
            ]
          : []),
        ...(data.fuelType
          ? [
              {
                title_en: "Fuel Type",
                title_ar: "نوع الوقود",
                key: "fuel_type",
                value_ar:
                  fuelNameType.find((item) => item.name_en === data.fuelType)
                    ?.name_ar || data.fuelType,
                value_en:
                  fuelNameType.find((item) => item.name_ar === data.fuelType)
                    ?.name_en || data.fuelType,
              },
            ]
          : []),
        ...(data.horsePower
          ? [
              {
                title_en: "Horse Power",
                title_ar: "قوة الحصان",
                key: "horse_power",
                value_ar:
                  horsePower.find((item) => item.name_en === data.horsePower)
                    ?.name_ar || data.horsePower,
                value_en:
                  horsePower.find((item) => item.name_ar === data.horsePower)
                    ?.name_en || data.horsePower,
              },
            ]
          : []),
        ...(data.theWeight
          ? [
              {
                title_en: "Weight",
                title_ar: "الوزن",
                key: "weight",
                value_ar: data.theWeight,
                value_en: data.theWeight,
              },
            ]
          : []),
        ...(data.condition
          ? [
              {
                title_en: "Condition",
                title_ar: "الحالة",
                key: "condition",
                value_ar:
                  condition.find((item) => item.name_en === data.condition)
                    ?.name_ar || data.condition,
                value_en:
                  condition.find((item) => item.name_ar === data.condition)
                    ?.name_en || data.condition,
              },
            ]
          : []),
        ...(data.conditionPrice
          ? [
              {
                title_en: "Advertisement Type",
                title_ar: "نوع الاعلان",
                key: "advertisement_type",
                value_ar:
                  conditionPriceType.find(
                    (item) => item.name_en === data.conditionPrice
                  )?.name_ar || data.conditionPrice,
                value_en:
                  conditionPriceType.find(
                    (item) => item.name_ar === data.conditionPrice
                  )?.name_en || data.conditionPrice,
              },
            ]
          : []),
      ],
    };
    try {
      // Here you would typically send the data to your API
      await addAdvertisement(formData).unwrap();
      toast({
        title: t.successTitle,
        description: t.successMessage,
        duration: 3000,
      });
      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        variant: "destructive",
        title: t.errorMessage,
        description: error?.data?.message,
      });
    }
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-2">
            {/* SubCategory */}
            <FormField
              control={form.control}
              name="Subsection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.subCategory}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedSubSection = SubSectionsData.find(
                        (subSection: SubSectionsType) =>
                          subSection.name === value
                      );
                      setSubCategoryID(
                        selectedSubSection ? selectedSubSection.id : null
                      );
                    }}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectSubSections} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SubSectionsData.map((subSection: SubSectionsType) => (
                        <SelectItem key={subSection.id} value={subSection.name}>
                          {subSection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.brand}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder={t.selectBrand}
                      {...field}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.model}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder={t.selectBrand}
                      {...field}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Year */}
            <FormField
              control={form.control}
              name="manufacturingYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.year}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder="2023"
                      {...field}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mileage */}
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.mileage}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder="10000 km"
                      {...field}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Price" : "السعر ب "}(
                    {Language.language === "en"
                      ? advertisement?.country?.symbol_en
                      : advertisement?.country?.symbol_ar}
                    )<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder="100000"
                      {...field}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Fuel Type */}
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.fuelType}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectFuelType} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelNameType
                        .filter((item) => item.id !== 4)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name_en}>
                            {lang === "en" ? item.name_en : item.name_ar}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CylindersCount */}
            <FormField
              control={form.control}
              name="cylindersCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Cylinders Count"
                      : "عدد الاسطوانات"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Cylinders Count"
                              : "اختر عدد الاسطوانات"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cylindersCount.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {Language.language === "en"
                            ? item.name_en
                            : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* horsePower */}
            <FormField
              control={form.control}
              name="horsePower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.horsePower}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectHorsePower} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {horsePower.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Exterior Color */}
            <FormField
              control={form.control}
              name="exteriorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.exteriorColor}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectExteriorColor} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorName.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Interior Color */}
            <FormField
              control={form.control}
              name="interiorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.interiorColor}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectExteriorColor} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorName.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* EnginCount */}
            <FormField
              control={form.control}
              name="engineCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.engineCount}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectEnginCount} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enginCount.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TheWeight */}
            <FormField
              control={form.control}
              name="theWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.theWeight}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder={t.enterTheWeight}
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.condition}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectCondition} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {condition.map((item) => (
                        <SelectItem key={item.id} value={item.value_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Condition Price */}
            <FormField
              control={form.control}
              name="conditionPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.conditionPrice}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectConditionPrice} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditionPriceType.map((item) => (
                        <SelectItem key={item.id} value={item.name_en}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Warranty */}
            <FormField
              control={form.control}
              name="Warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.warranty}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectWarranty} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WarrantyType.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
                          {lang === "en" ? item.name_en : item.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">
                  {t.description}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.enterDescription}
                    className="h-40 min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              variant="destructive"
              className="w-32"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <div className="flex gap-2 items-center">
                  <span>{t.loading}</span>
                  <Loader className="animate-spin" />
                </div>
              ) : (
                t.nextButtonTitle
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => router.back()}
            >
              {t.backButtonTitle}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
