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
import { MotoFormSchema, MotoFormValues } from "@/schemas/advertisement";
import { toast } from "@/hooks/use-toast";
import {
  useGetBrandsQuery,
  useGetSuSectionsQuery,
} from "@/store/apis/attrbuite";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { BrandType, ErrorType, SubSectionsType } from "@/types";
import {
  bikeEngineSize,
  colorName,
  condition,
  conditionPriceType,
  NumberOfTiresOfBicks,
  PowerTransmissionSystemType,
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
    selectBrand: "Select Brand",
    year: "Manufacturing Year",
    mileage: "Mileage",
    price: "Price",
    powerTransmissionSystem: "Power Transmission System",
    selectPowerTransSystem: "Select Power Transmission System",
    bikeEngineSize: "Engine Size",
    selectBikeEngineSize: "Select Engine Size",
    numberOfTiresOfBicks: "Number of Tires",
    selectNumOfTiresOfBicks: "Select Number of Tires",
    condition: "Condition",
    selectCondition: "Select Condition",
    exteriorColor: "Exterior Color",
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
    selectBrand: "اختر الماركة",
    year: "سنة الصنع",
    mileage: "المسافة المقطوعة",
    price: "السعر",
    powerTransmissionSystem: "نظام نقل القدرة",
    selectPowerTransSystem: "اختر نظام نقل القدرة",
    bikeEngineSize: "حجم المحرك",
    selectBikeEngineSize: "اختر حجم المحرك",
    numberOfTiresOfBicks: "عدد الإطارات",
    selectNumOfTiresOfBicks: "اختر عدد الإطارات",
    condition: "الحالة",
    selectCondition: "اختر الحالة",
    conditionPrice: "نوع الاعلان",
    selectConditionPrice: "اختر نوع الاعلان",
    exteriorColor: "اللون الخارجي",
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
    loading: "جار التحميل...",
  },
};

export default function AddAdMotoStepTow() {
  const [addAdvertisement, { isLoading }] = useAddAdvertisementMutation();
  const router = useRouter();
  const form = useForm<MotoFormValues>({
    resolver: zodResolver(MotoFormSchema),
    defaultValues: {
      subCategory: "",
      brand: "",
      year: "",
      mileage: "",
      price: "",
      powerTransmissionSystem: "",
      bikeEngineSize: "",
      numberOfTiresOfBicks: "",
      condition: "",
      conditionPrice: "",
      exteriorColor: "",
      warranty: "",
      description: "",
    },
  });

  const [BrandID, setBrandID] = useState(0);
  const [SubCategoryID, setSubCategoryID] = useState(0);
  const { Categories, Language, advertisement } = useAppSelector(
    (state: RootState) => state
  );
  const { data: brandsData } = useGetBrandsQuery({
    id: Categories.Categories.id,
  });
  const { data: subSectionsData } = useGetSuSectionsQuery({
    categoryID: Categories.Categories.id,
    lang: Language.language,
  });
  const BrandData = brandsData?.data?.brands || [];
  const SubSectionsData = subSectionsData?.data?.subcategories || [];
  const lang = Language.language;
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: MotoFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const advertisementStepOne = advertisement;
    const formData = {
      category_id: Categories.Categories.id,
      name: `${data.brand} ${data.year}`,
      phone: advertisementStepOne?.iso_code + advertisementStepOne?.phone,
      address: advertisementStepOne?.address,
      user_name: advertisementStepOne?.name,
      description_en: data.description,
      price: data.price,
      warranty: data.warranty === "true" ? true : false,
      condition: "used", // ['new', 'used']
      motion_vector: "manual",
      whatsapp: advertisementStepOne?.whatsappPreferred,
      type: data.conditionPrice, //  ['Fixed Price', 'Negotiable', 'Installment'];
      longitude: String(advertisementStepOne?.longitude),
      latitude: String(advertisementStepOne?.latitude),
      code: advertisementStepOne?.codeImage,
      brand_id: BrandID,
      model_id: "1",
      sub_category_id: SubCategoryID,
      country_id: advertisementStepOne?.country?.id,
      city_id: advertisementStepOne?.city?.id,
      standard_specifications: [
        {
          title_en: "Manufacturing Year",
          title_ar: "سنة الصنع",
          key: "manufacturing_year",
          value_ar: data.year,
          value_en: data.year,
        },
        {
          title_en: "Mileage",
          title_ar: "المسافة المقطوعة",
          key: "mileage",
          value_ar: data.mileage,
          value_en: data.mileage,
        },
        {
          title_en: "Category",
          title_ar: "الفئه",
          key: "car_category",
          value_ar: data.subCategory,
          value_en: data.subCategory,
        },
        {
          title_en: "Power Transmission System",
          title_ar: "نظام نقل القدرة",
          key: "power_transmission_system",
          value_ar:
            PowerTransmissionSystemType.find(
              (item) => item.name_en === data.powerTransmissionSystem
            )?.name_ar || data.powerTransmissionSystem,
          value_en:
            PowerTransmissionSystemType.find(
              (item) => item.name_ar === data.powerTransmissionSystem
            )?.name_en || data.powerTransmissionSystem,
        },
        {
          title_en: "Engine Size",
          title_ar: "حجم المحرك",
          key: "moto_engine",
          value_ar:
            bikeEngineSize.find((item) => item.name_en === data.bikeEngineSize)
              ?.name_ar || data.bikeEngineSize,
          value_en:
            bikeEngineSize.find((item) => item.name_ar === data.bikeEngineSize)
              ?.name_en || data.bikeEngineSize,
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
          title_en: "Number of Tires",
          title_ar: "عدد الطارات",
          key: "num_of_tries",
          value_ar:
            NumberOfTiresOfBicks.find(
              (item) => item.name_en === data.numberOfTiresOfBicks
            )?.name_ar || data.numberOfTiresOfBicks,
          value_en:
            NumberOfTiresOfBicks.find(
              (item) => item.name_ar === data.numberOfTiresOfBicks
            )?.name_en || data.numberOfTiresOfBicks,
        },
        {
          title_en: "Condition",
          title_ar: "الحالة",
          key: "condition",
          value_ar:
            condition.find((item) => item.value_en === data.condition)
              ?.value_ar || data.condition,
          value_en:
            condition.find((item) => item.value_ar === data.condition)
              ?.value_en || data.condition,
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
              name="subCategory"
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.subCategory} />
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedBrand = BrandData.find(
                        (brand: BrandType) => brand.name_en === value
                      );
                      setBrandID(selectedBrand ? selectedBrand.id : null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectBrand} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BrandData.map((brand: BrandType) => (
                        <SelectItem key={brand.id} value={brand.name_en}>
                          {lang === "en" ? brand.name_en : brand.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.year} <span className="text-red-500">*</span>
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
            {/* Power Transmission System */}
            <FormField
              control={form.control}
              name="powerTransmissionSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.powerTransmissionSystem}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectPowerTransSystem} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PowerTransmissionSystemType.map((item) => (
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
            {/* Bike Engine Size */}
            <FormField
              control={form.control}
              name="bikeEngineSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.bikeEngineSize}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectBikeEngineSize} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bikeEngineSize.map((item) => (
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
            {/* NumberOfTiresOfBicks */}
            <FormField
              control={form.control}
              name="numberOfTiresOfBicks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.bikeEngineSize}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectBikeEngineSize} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NumberOfTiresOfBicks.map((item) => (
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
              name="warranty"
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
