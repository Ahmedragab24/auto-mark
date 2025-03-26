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
import { CarFormSchema, type CarFormValues } from "@/schemas/advertisement";
import { toast } from "@/hooks/use-toast";
import { useGetBrandsQuery, useGetModelsQuery } from "@/store/apis/attrbuite";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { BrandType, ErrorType, ModelsType } from "@/types";
import {
  BatteryCapacity,
  ChargeDuration,
  ChargeRange,
  colorName,
  condition,
  conditionPriceType,
  cylindersCount,
  enginCount,
  fuelNameType,
  horsePower,
  numOfSeatsName,
  SelfDriving,
  specificationsType,
  structureType,
  transmissionType,
  WarrantyType,
} from "@/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddAdvertisementMutation } from "@/store/apis/advertisement";
import { Loader } from "lucide-react";

export default function AddAdCarStepTwo() {
  const [addAdvertisement, { isLoading }] = useAddAdvertisementMutation();
  const router = useRouter();
  const form = useForm<CarFormValues>({
    resolver: zodResolver(CarFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      style: "",
      year: "",
      mileage: "",
      price: "",
      specificationsType: "",
      fuelNameType: "",
      cylindersCount: "",
      structureType: "",
      enginCount: "",
      horsePower: "",
      exteriorColor: "",
      interiorColor: "",
      condition: "",
      numOfSeatsName: "",
      transmissionType: "",
      conditionPrice: "",
      warranty: "",
      description: "",
      batteryCapacity: "",
      chargeDuration: "",
      chargeRange: "",
      selfDriving: "",
    },
  });
  const [BrandID, setBrandID] = useState(0);
  const [ModelID, setModelID] = useState(0);
  const [modlesDataList, setModlesDataList] = useState<ModelsType[]>([]);
  const { Categories, advertisement, Language } = useAppSelector(
    (state: RootState) => state
  );
  const { data: brandsData } = useGetBrandsQuery({
    id: Categories.Categories.id,
  });
  const { data: modelsData } = useGetModelsQuery(
    { brand_id: BrandID },
    { skip: !BrandID }
  );
  const BrandData = brandsData?.data?.brands || [];
  const [IsClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [Language.language]);

  useEffect(() => {
    if (BrandID) {
      const modelData = modelsData?.data || [];
      setModlesDataList(modelData);
      form.setValue("model", "");
    }
  }, [form, BrandID, modelsData]);

  async function onSubmit(data: CarFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const advertisementStepOne = advertisement;
    const formData = {
      category_id: Categories.Categories.id,
      name: `${data.brand} ${data.model} ${data.year}`,
      phone: advertisementStepOne?.iso_code + advertisementStepOne?.phone,
      address: advertisementStepOne?.address,
      user_name: advertisementStepOne?.name,
      description_en: data.description,
      price: data.price,
      warranty: data.warranty === "true" ? true : false,
      condition: "used", // ['new', 'used']
      motion_vector: data.transmissionType,
      whatsapp: advertisementStepOne?.whatsappPreferred,
      type: data.conditionPrice, //  ['Fixed Price', 'Negotiable', 'Installment'];
      longitude: String(advertisementStepOne?.longitude),
      latitude: String(advertisementStepOne?.latitude),
      code: advertisementStepOne?.codeImage,
      brand_id: BrandID,
      model_id: ModelID,
      sub_category_id: "1",
      country_id: advertisementStepOne?.country?.id,
      city_id: advertisementStepOne?.city?.id,
      standard_specifications: [
        ...(data.year
          ? [
              {
                title_en: "Manufacturing Year",
                title_ar: "سنة الصنع",
                key: "manufacturing_year",
                value_ar: data.year,
                value_en: data.year,
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
        ...(data.numOfSeatsName
          ? [
              {
                title_en: "Number of Seats",
                title_ar: "عدد المقاعد",
                key: "number_of_seats",
                value_ar: data.numOfSeatsName,
                value_en: data.numOfSeatsName,
              },
            ]
          : []),
        ...(data.structureType
          ? [
              {
                title_en: "Structure Type",
                title_ar: "نوع الهيكل",
                key: "structure_type",
                value_ar:
                  structureType.find(
                    (item) => item.name_en === data.structureType
                  )?.name_ar || data.structureType,
                value_en:
                  structureType.find(
                    (item) => item.name_ar === data.structureType
                  )?.name_en || data.structureType,
              },
            ]
          : []),
        ...(data.style
          ? [
              {
                title_en: "Category",
                title_ar: "الفئه",
                key: "car_category",
                value_ar: data.style,
                value_en: data.style,
              },
            ]
          : []),
        ...(data.enginCount
          ? [
              {
                title_en: "Engine Capacity",
                title_ar: "سعة المحرك",
                key: "engine",
                value_ar: data.enginCount,
                value_en: data.enginCount,
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
                title_ar: "اللون الداخلي",
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
        ...(data.fuelNameType
          ? [
              {
                title_en: "Fuel Type",
                title_ar: "نوع الوقود",
                key: "fuel_type",
                value_ar:
                  fuelNameType.find(
                    (item) => item.name_en === data.fuelNameType
                  )?.name_ar || data.fuelNameType,
                value_en:
                  fuelNameType.find(
                    (item) => item.name_ar === data.fuelNameType
                  )?.name_en || data.fuelNameType,
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
        ...(data.specificationsType
          ? [
              {
                title_en: "Film specifications",
                title_ar: "المواصفات الإقليمية",
                key: "film_specifications",
                value_ar:
                  specificationsType.find(
                    (item) => item.name_en === data.specificationsType
                  )?.name_ar || data.specificationsType,
                value_en:
                  specificationsType.find(
                    (item) => item.name_ar === data.specificationsType
                  )?.name_en || data.specificationsType,
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
        ...(data.batteryCapacity
          ? [
              {
                title_en: "Battery Capacity",
                title_ar: "سعه البطارية",
                key: "battery_capacity",
                value_ar:
                  BatteryCapacity.find(
                    (item) => item.name_en === data.batteryCapacity
                  )?.name_ar || data.batteryCapacity,
                value_en:
                  BatteryCapacity.find(
                    (item) => item.name_ar === data.batteryCapacity
                  )?.name_en || data.batteryCapacity,
              },
            ]
          : []),
        ...(data.chargeDuration
          ? [
              {
                title_en: "Charge Duration",
                title_ar: "مدة الشحن",
                key: "charge_duration",
                value_ar:
                  ChargeDuration.find(
                    (item) => item.name_en === data.chargeDuration
                  )?.name_ar || data.chargeDuration,
                value_en:
                  ChargeDuration.find(
                    (item) => item.name_ar === data.chargeDuration
                  )?.name_en || data.chargeDuration,
              },
            ]
          : []),
        ...(data.chargeRange
          ? [
              {
                title_en: "Charge Range",
                title_ar: "النطاق",
                key: "charge_range",
                value_ar:
                  ChargeRange.find((item) => item.name_en === data.chargeRange)
                    ?.name_ar || data.chargeRange,
                value_en:
                  ChargeRange.find((item) => item.name_ar === data.chargeRange)
                    ?.name_en || data.chargeRange,
              },
            ]
          : []),
        ...(data.selfDriving
          ? [
              {
                title_en: "Autonomous Driving",
                title_ar: "قيادة ذاتية",
                key: "autonomous_driving",
                value_ar:
                  SelfDriving.find((item) => item.name_en === data.selfDriving)
                    ?.name_ar || data.selfDriving,
                value_en:
                  SelfDriving.find((item) => item.name_ar === data.selfDriving)
                    ?.name_en || data.selfDriving,
              },
            ]
          : []),
      ],
    };
    try {
      // Here you would typically send the data to your API
      const response = await addAdvertisement(formData).unwrap();

      localStorage.setItem("UserYourAdvertisements", JSON.stringify(response));

      toast({
        title:
          Language.language === "en"
            ? "Operation was successful"
            : "تمت العملية بنجاح",
        description:
          Language.language === "en"
            ? "Advertisement added successfully"
            : "تمت اضافة الإعلان بنجاح",
        duration: 3000,
      });
      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        variant: "destructive",
        title: Language.language === "en" ? "Error" : "خطأ",
        description: error?.data?.message,
      });
    } finally {
      setIsSubmitting(false); // Reset submission state regardless of success/failure
    }
  }

  if (!IsClient) return null;

  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          dir={Language.language === "ar" ? "rtl" : "ltr"}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-2">
            {/* Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Brand" : "الماركة"}
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
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Brand"
                              : "اختر الماركة"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BrandData.map((brand: BrandType) => (
                        <SelectItem key={brand.id} value={brand.name_en}>
                          {Language.language === "en"
                            ? brand.name_en
                            : brand.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {Language.language === "en" ? "Model" : "الموديل"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedModel = modlesDataList.find(
                        (model) => model.name_en === value
                      );
                      setModelID(selectedModel ? selectedModel.id : 0);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Model"
                              : "اختر الموديل"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!BrandID ? (
                        <div className="p-2 text-center text-muted-foreground text-sm">
                          {Language.language === "en"
                            ? "Please select a brand first"
                            : "يرجى تحديد الماركة اولا"}
                        </div>
                      ) : modlesDataList.length > 0 && BrandID ? (
                        modlesDataList.map((model: ModelsType) => (
                          <SelectItem key={model.id} value={model.name_en}>
                            {Language.language === "en"
                              ? model.name_en
                              : model.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground text-sm">
                          {Language.language === "en"
                            ? "No models available"
                            : "لا توجد موديلات متاحة"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Style */}
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Style (Optional)"
                      : "الفئة او الطراز (اختياري)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-12"
                      placeholder="SE, LE, Sport"
                      {...field}
                    />
                  </FormControl>
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
                    {Language.language === "en" ? "Year" : "سنة الصنع "}
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
                    {Language.language === "en"
                      ? "Mileage"
                      : "المسافة المقطوعة"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                      placeholder={
                        Language.language === "en" ? "10000 km" : "10000 كم"
                      }
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
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none "
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
            {/* SpecificationsType */}
            <FormField
              control={form.control}
              name="specificationsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Specifications Type"
                      : "المواصفات الاقليمية"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Specifications Type"
                              : "اختر المواصفات الاقليمية"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specificationsType.map((item) => (
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
            {/* FuelNameType */}
            <FormField
              control={form.control}
              name="fuelNameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Fuel Type" : "نوع الوقود"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Fuel Type"
                              : "اختر نوع الوقود"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelNameType.map((item) => (
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
            {/* Electricity Is True or false */}
            {form.watch("fuelNameType") === "Electricity" ? (
              <>
                {/* BatteryCapacity */}
                <FormField
                  control={form.control}
                  name="batteryCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {Language.language === "en"
                          ? "battery capacity"
                          : "سعة البطارية"}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={
                                Language.language === "en"
                                  ? "Select battery capacity"
                                  : "اختر سعة البطارية"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BatteryCapacity.map((item) => (
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

                {/* ChargeDuration */}
                <FormField
                  control={form.control}
                  name="chargeDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {Language.language === "en"
                          ? "Shipping duration"
                          : "مدة الشحن"}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={
                                Language.language === "en"
                                  ? "Select the shipping duration"
                                  : "اختر مدة الشحن"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ChargeDuration.map((item) => (
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

                {/* ChargeRange */}
                <FormField
                  control={form.control}
                  name="chargeRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {Language.language === "en" ? "rate" : "النطاق"}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={
                                Language.language === "en"
                                  ? "Select a range rate"
                                  : "اختر معدل النطاق"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ChargeRange.map((item) => (
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

                {/* SelfDriving  */}
                <FormField
                  control={form.control}
                  name="selfDriving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {Language.language === "en"
                          ? "Self driving"
                          : "قيادة ذاتية"}

                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={
                                Language.language === "en"
                                  ? "Select self driving"
                                  : "اختر القيادة الذاتية"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SelfDriving.map((item) => (
                            <SelectItem key={item.id} value={item.value_en}>
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
              </>
            ) : (
              <>
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
                        value={field.value}
                        defaultValue={field.value}
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
              </>
            )}
            {/* StructureType */}
            <FormField
              control={form.control}
              name="structureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Structure Type"
                      : "نوع الهيكل"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Structure Type"
                              : "اختر نوع الهيكل"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {structureType.map((item) => (
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
            {/* EnginCount */}
            <FormField
              control={form.control}
              name="enginCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Engine Count"
                      : " سعة المحرك (سي سي)"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Engine Count"
                              : "اختر سعة المحرك"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enginCount.map((item) => (
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
            {/* HorsePower */}
            <FormField
              control={form.control}
              name="horsePower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Horse Power" : "قوة الحصان"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Horse Power"
                              : "اختر قوة الحصان"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {horsePower.map((item) => (
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
            {/* Exterior Color */}
            <FormField
              control={form.control}
              name="exteriorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Exterior Color"
                      : "اللون الخارجي"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Color"
                              : "اختر اللون"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorName.map((item) => (
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
            {/* Interior Color */}
            <FormField
              control={form.control}
              name="interiorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Interior Color"
                      : "اللون الداخلي"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Color"
                              : "اختر اللون"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorName.map((item) => (
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
            {/* Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Condition" : "الحالة"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Condition"
                              : "اختر الحالة"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {condition.map((item) => (
                        <SelectItem key={item.id} value={item.value_en}>
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
            {/* NumOfSeatsName */}
            <FormField
              control={form.control}
              name="numOfSeatsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Number Of Seats"
                      : "عدد المقاعد"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Number Of Seats"
                              : "اختر عدد المقاعد"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numOfSeatsName.map((item) => (
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
            {/* TransmissionType */}
            <FormField
              control={form.control}
              name="transmissionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Transmission Type"
                      : "ناقل الحركة"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Transmission Type"
                              : "اختر ناقل الحركة"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transmissionType.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
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
            {/* Condition Price */}
            <FormField
              control={form.control}
              name="conditionPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en"
                      ? "Advertisement Type"
                      : "نوع الإعلان"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Advertisement Type"
                              : "اختر نوع الإعلان"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditionPriceType.map((item) => (
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
            {/* Warranty */}
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {Language.language === "en" ? "Warranty" : "الضمان"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue
                          placeholder={
                            Language.language === "en"
                              ? "Select Warranty"
                              : "اختر الضمان"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WarrantyType.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
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
          </div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">
                  {Language.language === "en" ? "Description" : "وصف الإعلان"}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      Language.language === "en"
                        ? "Enter Description"
                        : "ادخل وصف الإعلان"
                    }
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
                  <span>
                    {Language.language === "en" ? "Saving..." : "جاري الحفظ..."}
                  </span>
                  <Loader className="animate-spin" />
                </div>
              ) : Language.language === "en" ? (
                "Save"
              ) : (
                "حفظ"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onAbort={() => router.back()}
            >
              {Language.language === "en" ? "Back" : "العودة"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
