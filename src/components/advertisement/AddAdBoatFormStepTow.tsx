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
import { BoatFormSchema, type BoatFormValues } from "@/schemas/advertisement";
import { toast } from "@/hooks/use-toast";
import { useGetSuSectionsQuery } from "@/store/apis/attrbuite";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ErrorType, SubSectionsType } from "@/types";
import {
  colorName,
  condition,
  conditionPriceType,
  WarrantyType,
} from "@/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddAdvertisementMutation } from "@/store/apis/advertisement";
import { Loader } from "lucide-react";

const translations = {
  en: {
    Subsection: "Subsection",
    selectSubSections: "Select Sub Sections",
    brand: "Brand",
    selectBrand: "ُEnter Brand",
    theAge: "Age",
    enterTheAge: "Enter Age",
    theHeight: "Height",
    enterTheHeight: "Enter Height",
    price: "Price",
    exteriorColor: "Exterior Color",
    interiorColor: "Interior Color",
    selectExteriorColor: "Select Exterior Color",
    condition: "Condition",
    selectCondition: "Select Condition",
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
    Subsection: "القسم الفرعي",
    selectSubSections: "اختر القسم الفرعي",
    brand: "الماركة",
    selectBrand: "ادخل ماركة القارب",
    theAge: "العمر",
    enterTheAge: "ادخل العمر",
    theHeight: "الطول",
    enterTheHeight: "ادخل الطول",
    price: "السعر",
    exteriorColor: "اللون الخارجي",
    interiorColor: "اللون الداخلي",
    selectExteriorColor: "اختر اللون",
    condition: "الحالة",
    selectCondition: "اختر الحالة",
    conditionPrice: "نوع الاعلان",
    selectConditionPrice: "اختر نوع الاعلان",
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
    loading: "جار التحميل...",
  },
};

export default function AddAdBoatStepTwo() {
  const [addAdvertisement, { isLoading }] = useAddAdvertisementMutation();
  const router = useRouter();
  const form = useForm<BoatFormValues>({
    resolver: zodResolver(BoatFormSchema),
    defaultValues: {
      Subsection: "",
      brand: "",
      price: "",
      theAge: "",
      theHeight: "",
      exteriorColor: "",
      interiorColor: "",
      condition: "",
      conditionPrice: "",
      Warranty: "",
      description: "",
    },
  });
  const [SubCategoryID, setSubCategoryID] = useState(0);
  const { Categories, advertisement, Language } = useAppSelector(
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

  async function onSubmit(data: BoatFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const advertisementStepOne = advertisement;
    const formData = {
      category_id: Categories.Categories.id,
      name: data.brand || "",
      phone: advertisementStepOne?.iso_code + advertisementStepOne?.phone,
      address: advertisementStepOne?.address,
      user_name: advertisementStepOne?.name,
      description_en: data.description,
      price: data.price,
      warranty: data.Warranty === "true" ? true : false,
      condition: "used", // ['new', 'used']
      // motion_vector: "Manual",
      whatsapp: advertisementStepOne?.whatsappPreferred,
      type: data.conditionPrice, //  ['Fixed Price', 'Negotiable', 'Installment'];
      longitude: String(advertisementStepOne?.longitude),
      latitude: String(advertisementStepOne?.latitude),
      code: advertisementStepOne?.codeImage,
      // brand_id: BrandID,
      // model_id: 0,
      sub_category_id: SubCategoryID,
      country_id: advertisementStepOne?.country?.id,
      city_id: advertisementStepOne?.city?.id,
      standard_specifications: [
        {
          title_en: "Age",
          title_ar: "العمر",
          key: "age",
          value_ar: data.theAge,
          value_en: data.theAge,
        },
        {
          title_en: "Height",
          title_ar: "الطول",
          key: "height",
          value_ar: data.theHeight,
          value_en: data.theHeight,
        },
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
        {
          title_en: "Interior Color",
          title_ar: "اللون الداخلي",
          key: "interior_color",
          value_ar:
            colorName.find((item) => item.name_en === data.interiorColor)
              ?.name_ar || data.interiorColor,
          value_en:
            colorName.find((item) => item.name_ar === data.interiorColor)
              ?.name_en || data.interiorColor,
        },
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
                    {t.Subsection}
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
                        selectedSubSection ? selectedSubSection.id : 0
                      );
                    }}
                    value={field.value}
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
                      className="h-12 "
                      placeholder={t.selectBrand}
                      {...field}
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
            {/* The Age */}
            <FormField
              control={form.control}
              name="theAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.theAge}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder="6"
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
            {/* The Height */}
            <FormField
              control={form.control}
              name="theHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.theHeight}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder="10000 cm"
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
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
