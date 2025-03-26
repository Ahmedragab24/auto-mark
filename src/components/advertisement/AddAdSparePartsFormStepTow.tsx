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
import {
  SparePartsFormSchema,
  SparePartsFormValues,
} from "@/schemas/advertisement";
import { toast } from "@/hooks/use-toast";
import {
  useGetAutoPartsTypesCategoriesQuery,
  useGetAutoPartsTypesQuery,
} from "@/store/apis/attrbuite";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { ErrorType } from "@/types";
import { conditionPriceType, deliveryService } from "@/constants";
import { useState } from "react";
import { useAddAdvertisementMutation } from "@/store/apis/advertisement";
import { useRouter } from "next/navigation";
import { AutoPartsType } from "@/store/features/attributes/autoParts";
import { Loader } from "lucide-react";

const translations = {
  en: {
    type: "Type",
    selectType: "Select Type",
    section: "Section",
    selectSections: "Select Section",
    name: "Name of Advertisement",
    enterName: "Enter Name",
    price: "Price",
    conditionPrice: "Advertisement type",
    selectConditionPrice: "Select Advertisement type",
    deliveryService: "Delivery Service",
    selectDeliveryService: "Select Delivery Service",
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
    selectSection: "Select Type First",
  },
  ar: {
    type: "النوع",
    selectType: "اختر النوع",
    section: "القسم الفرعي",
    selectSections: "اختر القسم الفرعي",
    name: "اسم الإعلان",
    enterName: "ادخل اسم الإعلان هنا",
    price: "السعر",
    conditionPrice: "نوع الاعلان",
    selectConditionPrice: "اختر نوع الاعلان",
    deliveryService: "خدمة التوصيل",
    selectDeliveryService: "اختر خدمة التوصيل",
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
    selectSection: "اختر النوع اولا",
  },
};

export default function AddAdSparePartsStepTow() {
  const [addAdvertisement, { isLoading }] = useAddAdvertisementMutation();
  const router = useRouter();
  const form = useForm<SparePartsFormValues>({
    resolver: zodResolver(SparePartsFormSchema),
    defaultValues: {
      type: "",
      section: "",
      name: "",
      price: "",
      conditionPrice: "",
      deliveryService: "",
      description: "",
    },
  });

  const [TypeID, setTypeID] = useState(0);
  const [TypeCategoryID, setTypeCategoryID] = useState(0);
  const { advertisement, Language, Categories } = useAppSelector(
    (state: RootState) => state
  );

  const { data: autoPartsData } = useGetAutoPartsTypesQuery("autoParts");
  const { data: autoPartsDataCategories } =
    useGetAutoPartsTypesCategoriesQuery(TypeID);

  const AutoPartsData = autoPartsData?.data?.autoPartsType || [];
  const AutoPartsDataCategory =
    autoPartsDataCategories?.data?.autoPartsCategory || [];
  const lang = Language.language;
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: SparePartsFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const advertisementStepOne = advertisement;
    const formData = {
      category_id: Categories.Categories.id,
      name: data.name,
      phone: advertisementStepOne?.iso_code + advertisementStepOne?.phone,
      address: advertisementStepOne?.address,
      user_name: advertisementStepOne?.name,
      description_en: data.description,
      price: data.price,
      // warranty: data.deliveryService === "true" ? true : false,
      condition: "used", // ['new', 'used']
      // motion_vector: "manual",
      whatsapp: advertisementStepOne?.whatsappPreferred,
      type: data.conditionPrice, //  ['Fixed Price', 'Negotiable', 'Installment'];
      longitude: String(advertisementStepOne?.longitude),
      latitude: String(advertisementStepOne?.latitude),
      code: advertisementStepOne?.codeImage,
      // brand_id: null,
      // model_id: null,
      sub_category_id: 1,
      country_id: advertisementStepOne?.country?.id,
      city_id: advertisementStepOne?.city?.id,
      standard_specifications: [
        {
          title_en: "category",
          title_ar: "القسم",
          key: "service_category",
          value_ar:
            AutoPartsData.find(
              (item: AutoPartsType) => item.name_en === data.section
            )?.name_ar || data.section,
          value_en:
            AutoPartsData.find(
              (item: AutoPartsType) => item.name_ar === data.section
            )?.name_en || data.section,
          category_id: TypeCategoryID,
        },
        {
          title_en: "type",
          key: "auto_parts_type",
          title_ar: "نوع",
          value_ar:
            AutoPartsDataCategory.find(
              (item: AutoPartsType) => item.name_en === data.type
            )?.name_ar || data.type,
          value_en:
            AutoPartsDataCategory.find(
              (item: AutoPartsType) => item.name_ar === data.type
            )?.name_en || data.type,
        },
        {
          title_en: "Delivery Service",
          title_ar: "خدمة التوصيل",
          key: "service_delivery",
          value_ar:
            deliveryService.find(
              (item) => item.name_en === data.deliveryService
            )?.name_ar || data.deliveryService,
          value_en:
            deliveryService.find(
              (item) => item.name_ar === data.deliveryService
            )?.name_en || data.deliveryService,
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
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.name}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-12"
                      placeholder={t.enterName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.type}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedType = AutoPartsData.find(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (type: any) =>
                          lang === "en"
                            ? type.name_en === value
                            : type.name_ar === value
                      );
                      setTypeID(selectedType ? selectedType.id : null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectType} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {AutoPartsData.map((subSection: any) => (
                        <SelectItem
                          key={subSection.id}
                          value={
                            lang === "en"
                              ? subSection.name_en
                              : subSection.name_ar
                          }
                        >
                          {lang === "en"
                            ? subSection.name_en
                            : subSection.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* SubCategory */}
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.section}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedType = AutoPartsDataCategory.find(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (type: any) =>
                          lang === "en"
                            ? type.name_en === value
                            : type.name_ar === value
                      );
                      setTypeCategoryID(selectedType ? selectedType.id : null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectSections} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TypeID ? (
                        AutoPartsDataCategory.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (subSection: any) => (
                            <SelectItem
                              key={subSection.id}
                              value={
                                lang === "en"
                                  ? subSection.name_en
                                  : subSection.name_ar
                              }
                            >
                              {lang === "en"
                                ? subSection.name_en
                                : subSection.name_ar}
                            </SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem key={0} value="false">
                          {t.selectSection}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none pl-12"
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
            {/* deliveryService */}
            <FormField
              control={form.control}
              name="deliveryService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">
                    {t.deliveryService}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.selectDeliveryService} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliveryService.map((item) => (
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
