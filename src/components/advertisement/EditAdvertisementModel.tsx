"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Loader, Trash2, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type {
  BrandType,
  ErrorType,
  ModelsType,
  ProductType,
  SubSectionsType,
} from "@/types";

import {
  useDeleteImagesMutation,
  useUpdateAdvertisementsUserMutation,
} from "@/store/apis/advertisement";
import {
  useGetAutoPartsTypesCategoriesQuery,
  useGetAutoPartsTypesQuery,
  useGetBrandsQuery,
  useGetModelsQuery,
  useGetSuSectionsQuery,
} from "@/store/apis/attrbuite";
import {
  BatteryCapacity,
  bikeEngineSize,
  ChargeDuration,
  ChargeRange,
  colorName,
  condition,
  conditionPriceType,
  cylindersCount,
  deliveryService,
  enginCount,
  fuelNameType,
  horsePower,
  NumberOfTiresOfBicks,
  numOfSeatsName,
  PowerTransmissionSystemType,
  SelfDriving,
  specificationsType,
  structureType,
  SubSectionsServicesType,
  WarrantyType,
} from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { useGetProductsByIdQuery } from "@/store/apis/products";
import type { AutoPartsType } from "@/store/features/attributes/autoParts";

interface IProps {
  IsModelOpen: boolean;
  IsModelOpenChange: (state: boolean) => void;
  productID: number;
}

// Form validation schema
const formSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  subSection: z.string().optional(),
  subSectionServices: z.string().optional(),
  condition: z.string().optional(),
  specificationsType: z.string().optional(),
  fuelNameType: z.string().optional(),
  cylindersCount: z.string().optional(),
  structureType: z.string().optional(),
  enginCount: z.string().optional(),
  horsePower: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  numOfSeatsName: z.string().optional(),
  powerTransmissionSystem: z.string().optional(),
  bikeEngineSize: z.string().optional(),
  numberOfTiresOfBicks: z.string().optional(),
  theWeight: z.string().optional(),
  theAge: z.string().optional(),
  theHeight: z.string().optional(),
  type: z.string().optional(),
  section: z.string().optional(),
  conditionPrice: z.string().optional(),
  year: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  mileage: z.string().optional(),
  address: z.string().optional(),
  description_en: z.string().optional(),
  deliveryService: z.string().optional(),
  warranty: z.string().optional(),
  motion_vector: z.string().optional(),
  sub_category: z.any().optional(),
  batteryCapacity: z.string().optional(),
  chargeDuration: z.string().optional(),
  chargeRange: z.string().optional(),
  selfDriving: z.string().optional(),
  autoPartsType: z.string().optional(),
});

const EditAdvertisementModel = ({
  IsModelOpen,
  IsModelOpenChange,
  productID,
}: IProps) => {
  const [isClient, setIsClient] = useState(false);
  const { language } = useAppSelector((state) => state.Language);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (IsModelOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [IsModelOpen]);

  // Fetch product data
  const { data } = useGetProductsByIdQuery(
    {
      id: Number(productID),
      lang: language,
    },
    {
      skip: !productID || !IsModelOpen,
    }
  );

  const product: ProductType = data?.data?.product;

  console.log("Product", product);

  // API mutations
  const [updateAdvertisement, { isLoading: isLoadingUpdate }] =
    useUpdateAdvertisementsUserMutation();
  const [deleteImages, { isLoading: isLoadingDeleteImages }] =
    useDeleteImagesMutation();

  // Local state
  const [brandID, setBrandID] = useState<number>(0);
  const [modelID, setModelID] = useState<number>(0);
  const [modlesDataList, setModlesDataList] = useState<ModelsType[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<number>(0);
  const [typeID, setTypeID] = useState<number>(0);
  const [typeCategoryID, setTypeCategoryID] = useState<number>(0);

  // Fetch subcategories
  const { data: subSectionsData } = useGetSuSectionsQuery(
    {
      categoryID: product?.category_id || 7,
      lang: language,
    },
    {
      skip: !product?.category_id || !IsModelOpen,
    }
  );

  const subSectionsData2 = useMemo(
    () => subSectionsData?.data?.subcategories || [],
    [subSectionsData?.data?.subcategories]
  );

  // Fetch auto parts data
  const { data: autoPartsData } = useGetAutoPartsTypesQuery("autoParts", {
    skip: !IsModelOpen,
  });

  const { data: autoPartsDataCategories } = useGetAutoPartsTypesCategoriesQuery(
    typeID,
    {
      skip: !typeID || !IsModelOpen,
    }
  );

  const autoPartsData2 = useMemo(
    () => autoPartsData?.data?.autoPartsType || [],
    [autoPartsData?.data?.autoPartsType]
  );
  const autoPartsDataCategory2 = useMemo(
    () => autoPartsDataCategories?.data?.autoPartsCategory || [],
    [autoPartsDataCategories?.data?.autoPartsCategory]
  );

  // Get brands data
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery(
    {
      id: product?.category_id || 1,
    },
    {
      skip: !product?.category_id || !IsModelOpen,
    }
  );

  // Get models data when brand is selected
  const { data: modelsData, isLoading: isLoadingModels } = useGetModelsQuery(
    { brand_id: brandID },
    { skip: brandID === 0 || !IsModelOpen }
  );

  const brandData = useMemo(
    () => brandsData?.data?.brands || [],
    [brandsData?.data?.brands]
  );

  const modelData = useMemo(() => modelsData?.data || [], [modelsData?.data]);

  // Extract specifications from product
  const getSpecValue = useCallback(
    (key: string) => {
      if (!product?.standardSpecification) return "";
      const spec = product.standardSpecification.find(
        (spec) => spec.key === key
      );
      return spec && language === "en" ? spec.value_en : spec?.value_ar;
    },
    [product?.standardSpecification, language]
  );

  // Set Name Brand & Name Model IF Category ID == 3 || 4
  const getBrandFromName = useCallback(() => {
    if (!product?.name) return "";
    if (product.category_id === 3 || product.category_id === 4) {
      const parts = product.name.split(" ");
      return parts[0] || "";
    }
    return "";
  }, [product?.name, product?.category_id]);

  const getModelFromName = useCallback(() => {
    if (!product?.name) return "";
    if (product.category_id === 3 || product.category_id === 4) {
      const parts = product.name.split(" ");
      return parts.length > 1 ? parts[1] : "";
    }
    return "";
  }, [product?.name, product?.category_id]);

  // Initialize form with product data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      name: "",
      subSection: "",
      sub_category: "",
      condition: "",
      specificationsType: "",
      fuelNameType: "",
      cylindersCount: "",
      structureType: "",
      enginCount: "",
      horsePower: "",
      exteriorColor: "",
      interiorColor: "",
      numOfSeatsName: "",
      powerTransmissionSystem: "",
      bikeEngineSize: "",
      numberOfTiresOfBicks: "",
      theWeight: "",
      theAge: "",
      theHeight: "",
      type: "",
      section: "",
      subSectionServices: "",
      conditionPrice: "",
      year: "",
      price: "",
      mileage: "",
      address: "",
      description_en: "",
      warranty: "",
      deliveryService: "",
      motion_vector: "auto",
      batteryCapacity: "",
      chargeDuration: "",
      chargeRange: "",
      selfDriving: "",
    },
    mode: "onChange",
  });

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set subcategory ID when product data is loaded
  useEffect(() => {
    if (product?.sub_category_id && !subCategoryID) {
      setSubCategoryID(product.sub_category_id);
    }
  }, [product?.sub_category_id, subCategoryID]);

  // Clear electric/non-electric fields when fuel type changes
  const watchedFuelType = form.watch("fuelNameType");

  useEffect(() => {
    if (watchedFuelType && watchedFuelType !== "Electricity") {
      // Clear electric vehicle fields when fuel type is not Electricity
      form.setValue("batteryCapacity", "");
      form.setValue("chargeDuration", "");
      form.setValue("chargeRange", "");
      form.setValue("selfDriving", "");
    } else if (watchedFuelType === "Electricity") {
      // Clear cylinder count when fuel type is Electricity
      form.setValue("cylindersCount", "");
    }
  }, [watchedFuelType, form]);

  // Set brand and model IDs when product data is loaded
  useEffect(() => {
    if (product) {
      // Set brand ID from product
      if (product.brand?.id) {
        setBrandID(product.brand.id);
      }

      // Set model ID from product
      if (product.model_brand?.id) {
        setModelID(product.model_brand.id);
      }
    }
  }, [product]);

  // Update models list when brand changes
  useEffect(() => {
    if (brandID && modelsData?.data) {
      setModlesDataList(modelsData.data);

      // If we have a model from the product but it's not set in the form yet
      if (product?.model_brand?.id && !modelID) {
        setModelID(product.model_brand.id);
        form.setValue("model", product.model_brand.name_en || "");
      }
    }
  }, [brandID, modelsData, product?.model_brand, form, modelID]);

  // Update form when product data is loaded
  useEffect(() => {
    if (product && IsModelOpen) {
      // For auto parts, set the type ID when product data is loaded
      if (product?.category_id === 5) {
        const autoPartType = getSpecValue("auto_parts_type");
        if (autoPartType) {
          const selectedType = autoPartsData2.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (type: any) =>
              type.name_en === autoPartType || type.name_ar === autoPartType
          );
          if (selectedType) {
            setTypeID(selectedType.id);
          }
        }
      }

      // Update form values
      form.reset({
        brand:
          product?.category_id !== 3 && product?.category_id !== 4
            ? product?.brand?.name_en
            : getBrandFromName(),
        model:
          product?.category_id !== 3 && product?.category_id !== 4
            ? language === "en"
              ? product?.model_brand?.name_en
              : product?.model_brand?.name_ar
            : getModelFromName(),
        name: product?.name || "",
        subSection: product?.sub_category_id
          ? subSectionsData2.find(
              (x: SubSectionsType) => x.id === product?.sub_category_id
            )?.name || ""
          : "",
        sub_category: getSpecValue("car_category"),
        condition: getSpecValue("condition"),
        specificationsType: getSpecValue("film_specifications"),
        fuelNameType: getSpecValue("fuel_type"),
        cylindersCount: getSpecValue("cylinders"),
        structureType: getSpecValue("structure_type"),
        enginCount: getSpecValue("engine"),
        horsePower: getSpecValue("horse_power"),
        exteriorColor: getSpecValue("exterior_color"),
        interiorColor: getSpecValue("interior_color"),
        numOfSeatsName: getSpecValue("number_of_seats"),
        powerTransmissionSystem: getSpecValue("power_transmission_system"),
        bikeEngineSize: getSpecValue("moto_engine"),
        numberOfTiresOfBicks: getSpecValue("num_of_tries"),
        theWeight: getSpecValue("weight"),
        theAge: getSpecValue("age"),
        theHeight: getSpecValue("height"),
        type: getSpecValue("auto_parts_type"),
        section:
          getSpecValue("auto_parts_category") ||
          getSpecValue("service_category"),
        subSectionServices: getSpecValue("service_category"),
        conditionPrice: conditionPriceType.find(
          (c) => c.value_ar === product?.type || c.value_en === product?.type
        )?.value_en,
        year: getSpecValue("manufacturing_year") || "",
        price: product?.price?.toString() || "",
        mileage: getSpecValue("mileage") || "",
        address: product?.address || "",
        description_en: product?.description_en || "",
        warranty: product?.warranty ? "true" : "false",
        deliveryService: getSpecValue("service_delivery") || "",
        motion_vector: product?.motion_vector || "auto",
        batteryCapacity: getSpecValue("battery_capacity") || "",
        chargeDuration: getSpecValue("charge_duration") || "",
        chargeRange: getSpecValue("charge_range") || "",
        selfDriving: getSpecValue("autonomous_driving") || "",
      });
    }
  }, [
    language,
    product,
    IsModelOpen,
    form,
    getSpecValue,
    subSectionsData2,
    autoPartsData2,
    getBrandFromName,
    getModelFromName,
  ]);

  // Handle form submission
  const handleUpdate = async (data: z.infer<typeof formSchema>) => {
    if (!product?.id) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description:
          language === "en" ? "Product ID is missing" : "معرف المنتج مفقود",
        variant: "destructive",
      });
      return;
    }

    // Prepare standard specifications
    const standard_specifications = [];

    // Add specifications if they exist
    if (data.year) {
      standard_specifications.push({
        title_en: "Manufacturing Year",
        title_ar: "سنة الصنع",
        key: "manufacturing_year",
        value_ar: data.year,
        value_en: data.year,
      });
    }

    if (data.mileage) {
      standard_specifications.push({
        title_en: "Mileage",
        title_ar: "المسافة المقطوعة",
        key: "mileage",
        value_ar: data.mileage,
        value_en: data.mileage,
      });
    }

    if (data.sub_category) {
      standard_specifications.push({
        title_en: "Category",
        title_ar: "الفئه",
        key: "car_category",
        value_ar: data.sub_category,
        value_en: data.sub_category,
      });
    }

    if (data.specificationsType) {
      standard_specifications.push({
        title_en: "Regional Specifications",
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
      });
    }

    if (data.fuelNameType) {
      standard_specifications.push({
        title_en: "Fuel Type",
        title_ar: "نوع الوقود",
        key: "fuel_type",
        value_ar:
          fuelNameType.find((item) => item.name_en === data.fuelNameType)
            ?.name_ar || data.fuelNameType,
        value_en:
          fuelNameType.find((item) => item.name_ar === data.fuelNameType)
            ?.name_en || data.fuelNameType,
      });
    }

    // Only add cylindersCount if fuel type is not Electricity
    if (
      data.cylindersCount &&
      data.fuelNameType !== "Electricity" &&
      data.fuelNameType !== "كهرباء"
    ) {
      standard_specifications.push({
        title_en: "Number of Cylinders",
        title_ar: "عدد الأسطوانات",
        key: "cylinders",
        value_ar:
          cylindersCount.find((item) => item.name_en === data.cylindersCount)
            ?.name_ar || data.cylindersCount,
        value_en:
          cylindersCount.find((item) => item.name_ar === data.cylindersCount)
            ?.name_en || data.cylindersCount,
      });
    }

    // Only add electric vehicle specs if fuel type is Electricity
    if (
      (data.fuelNameType === "Electricity" || data.fuelNameType === "كهرباء") &&
      data.batteryCapacity
    ) {
      standard_specifications.push({
        title_en: "Battery Capacity",
        title_ar: "سعه البطارية",
        key: "battery_capacity",
        value_ar:
          BatteryCapacity.find((item) => item.name_en === data.batteryCapacity)
            ?.name_ar || data.batteryCapacity,
        value_en:
          BatteryCapacity.find((item) => item.name_ar === data.batteryCapacity)
            ?.name_en || data.batteryCapacity,
      });
    }

    if (
      (data.fuelNameType === "Electricity" || data.fuelNameType === "كهرباء") &&
      data.chargeDuration
    ) {
      standard_specifications.push({
        title_en: "Charge Duration",
        title_ar: "مدة الشحن",
        key: "charge_duration",
        value_ar:
          ChargeDuration.find((item) => item.name_en === data.chargeDuration)
            ?.name_ar || data.chargeDuration,
        value_en:
          ChargeDuration.find((item) => item.name_ar === data.chargeDuration)
            ?.name_en || data.chargeDuration,
      });
    }

    if (
      (data.fuelNameType === "Electricity" || data.fuelNameType === "كهرباء") &&
      data.chargeRange
    ) {
      standard_specifications.push({
        title_en: "Charge Range",
        title_ar: "النطاق",
        key: "charge_range",
        value_ar:
          ChargeRange.find((item) => item.name_en === data.chargeRange)
            ?.name_ar || data.chargeRange,
        value_en:
          ChargeRange.find((item) => item.name_ar === data.chargeRange)
            ?.name_en || data.chargeRange,
      });
    }

    if (
      (data.fuelNameType === "Electricity" || data.fuelNameType === "كهرباء") &&
      data.selfDriving
    ) {
      standard_specifications.push({
        title_en: "Autonomous Driving",
        title_ar: "قيادة ذاتية",
        key: "autonomous_driving",
        value_ar:
          SelfDriving.find((item) => item.name_en === data.selfDriving)
            ?.name_ar || data.selfDriving,
        value_en:
          SelfDriving.find((item) => item.name_ar === data.selfDriving)
            ?.name_en || data.selfDriving,
      });
    }

    if (data.structureType) {
      standard_specifications.push({
        title_en: "Structure Type",
        title_ar: "نوع الهيكل",
        key: "structure_type",
        value_ar:
          structureType.find((item) => item.name_en === data.structureType)
            ?.name_ar || data.structureType,
        value_en:
          structureType.find((item) => item.name_ar === data.structureType)
            ?.name_en || data.structureType,
      });
    }

    if (data.enginCount) {
      standard_specifications.push({
        title_en: "Engine Capacity",
        title_ar: "سعة المحرك",
        key: "engine",
        value_ar:
          enginCount.find((item) => item.name_en === data.enginCount)
            ?.name_ar || data.enginCount,
        value_en:
          enginCount.find((item) => item.name_ar === data.enginCount)
            ?.name_en || data.enginCount,
      });
    }

    if (data.horsePower) {
      standard_specifications.push({
        title_en: "Horse Power",
        title_ar: "قوة الحصان",
        key: "horse_power",
        value_ar:
          horsePower.find((item) => item.name_en === data.horsePower)
            ?.name_ar || data.horsePower,
        value_en:
          horsePower.find((item) => item.name_ar === data.horsePower)
            ?.name_en || data.horsePower,
      });
    }

    if (data.exteriorColor) {
      standard_specifications.push({
        title_en: "Exterior Color",
        title_ar: "اللون الخارجي",
        key: "exterior_color",
        value_ar:
          colorName.find((item) => item.name_en === data.exteriorColor)
            ?.name_ar || data.exteriorColor,
        value_en:
          colorName.find((item) => item.name_ar === data.exteriorColor)
            ?.name_en || data.exteriorColor,
      });
    }

    if (data.interiorColor) {
      standard_specifications.push({
        title_en: "Interior Color",
        title_ar: "اللون الداخلي",
        key: "interior_color",
        value_ar:
          colorName.find((item) => item.name_en === data.interiorColor)
            ?.name_ar || data.interiorColor,
        value_en:
          colorName.find((item) => item.name_ar === data.interiorColor)
            ?.name_en || data.interiorColor,
      });
    }

    if (data.numOfSeatsName) {
      standard_specifications.push({
        title_en: "Number of Seats",
        title_ar: "عدد المقاعد",
        key: "number_of_seats",
        value_ar:
          numOfSeatsName.find((item) => item.name_en === data.numOfSeatsName)
            ?.name_ar || data.numOfSeatsName,
        value_en:
          numOfSeatsName.find((item) => item.name_ar === data.numOfSeatsName)
            ?.name_en || data.numOfSeatsName,
      });
    }

    if (data.powerTransmissionSystem) {
      standard_specifications.push({
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
      });
    }

    if (data.bikeEngineSize) {
      standard_specifications.push({
        title_en: "Engine Size",
        title_ar: "حجم المحرك",
        key: "moto_engine",
        value_ar:
          bikeEngineSize.find((item) => item.name_en === data.bikeEngineSize)
            ?.name_ar || data.bikeEngineSize,
        value_en:
          bikeEngineSize.find((item) => item.name_ar === data.bikeEngineSize)
            ?.name_en || data.bikeEngineSize,
      });
    }

    if (data.numberOfTiresOfBicks) {
      standard_specifications.push({
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
      });
    }

    if (data.theWeight) {
      standard_specifications.push({
        title_en: "weight",
        title_ar: "الوزن",
        key: "weight",
        value_ar: data.theWeight,
        value_en: data.theWeight,
      });
    }

    if (data.theAge) {
      standard_specifications.push({
        title_en: "Age",
        title_ar: "العمر",
        key: "age",
        value_ar: data.theAge,
        value_en: data.theAge,
      });
    }

    if (data.theHeight) {
      standard_specifications.push({
        title_en: "Height",
        title_ar: "الطول",
        key: "height",
        value_ar: data.theHeight,
        value_en: data.theHeight,
      });
    }

    if (data.subSection) {
      standard_specifications.push({
        title_en: "category",
        title_ar: "القسم",
        key: "service_category",
        value_ar:
          subSectionsData2.find(
            (item: SubSectionsType) => item.name === data.subSection
          )?.name || data.subSection,
        value_en:
          subSectionsData2.find(
            (item: SubSectionsType) => item.name === data.subSection
          )?.name_en || data.subSection,
      });
    }

    if (data.type) {
      standard_specifications.push({
        title_en: "type",
        title_ar: "نوع",
        key: "auto_parts_type",
        value_ar:
          autoPartsData2.find(
            (item: AutoPartsType) => item.name_en === data.type
          )?.name_ar || data.type,
        value_en:
          autoPartsData2.find(
            (item: AutoPartsType) => item.name_ar === data.type
          )?.name_en || data.type,
      });
    }

    if (data.section) {
      standard_specifications.push({
        title_en: "category",
        title_ar: "القسم",
        key: "service_category",
        value_ar:
          autoPartsDataCategory2.find(
            (item: AutoPartsType) => item.name_en === data.section
          )?.name_ar || data.section,
        value_en:
          autoPartsDataCategory2.find(
            (item: AutoPartsType) => item.name_ar === data.section
          )?.name_en || data.section,
        category_id: typeCategoryID,
      });
    }

    if (data.condition) {
      standard_specifications.push({
        title_en: "Condition",
        title_ar: "الحالة",
        key: "condition",
        value_ar:
          condition.find((item) => item.value_en === data.condition)
            ?.value_ar || data.condition,
        value_en:
          condition.find((item) => item.name_ar === data.condition)?.name_en ||
          data.condition,
      });
    }

    if (data.subSectionServices) {
      standard_specifications.push({
        title_en: "category",
        title_ar: "القسم",
        key: "service_category",
        value_ar:
          SubSectionsServicesType.find(
            (item) => item.name_en === data.subSectionServices
          )?.name_ar || data.subSectionServices,
        value_en:
          SubSectionsServicesType.find(
            (item) => item.name_ar === data.subSectionServices
          )?.name_en || data.subSectionServices,
      });
    }

    if (data.deliveryService) {
      standard_specifications.push({
        title_en: "Delivery Service",
        title_ar: "خدمة التوصيل",
        key: "service_delivery",
        value_ar:
          deliveryService.find((item) => item.name_en === data.deliveryService)
            ?.name_ar || data.deliveryService,
        value_en:
          deliveryService.find((item) => item.name_ar === data.deliveryService)
            ?.name_en || data.deliveryService,
      });
    }

    // Prepare form data
    const formData = {
      category_id: product?.category_id || 1,
      name:
        data.brand || data.model
          ? `${data.brand} ${data.model} ${data.year || ""}`.trim()
          : data.name,
      phone: product?.phone || "",
      address: data.address || "",
      description_en: data.description_en || "",
      warranty: data.warranty === "true", // Convert string back to boolean
      motion_vector: data.motion_vector || "auto",
      price: String(data.price),
      type: data.conditionPrice || "Fixed Price",
      ...(brandID ? { brand_id: brandID } : {}),
      ...(modelID ? { model_id: modelID } : {}),
      ...(data.sub_category ? { sub_category: data.sub_category } : {}),
      sub_category_id: subCategoryID || product?.sub_category_id,
      standard_specifications: standard_specifications,
    };

    console.log("formData , formData");
    console.log("standard_specifications", standard_specifications);

    try {
      console.log("formData , formData");
      console.log("standard_specifications", standard_specifications);
      // Call API to update advertisement
      await updateAdvertisement({
        id: Number(product?.id),
        formData: formData,
      }).unwrap();

      toast({
        title: language === "en" ? "Success" : "نجاح",
        description:
          language === "en"
            ? "The ad has been successfully updated."
            : "تم تحديث الإعلان بنجاح",
      });

      // setTimeout(() => {
      //   window.location.reload();
      //   window.scrollTo({ top: 0, behavior: "smooth" });
      // }, 1000);

      IsModelOpenChange(false);
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description:
          error?.data?.message ||
          (language === "en"
            ? "An error occurred during update"
            : "حدث خطأ أثناء التحديث"),
        variant: "destructive",
      });
    }
  };

  // Delete image function
  const deleteImage = async (id: number) => {
    if (!id) return;

    setDeletingImageId(id);
    try {
      await deleteImages(id).unwrap();

      toast({
        title: language === "en" ? "Image deleted" : "تم حذف الصورة",
        description:
          language === "en"
            ? "The image has been successfully deleted."
            : "تم حذف الصورة بنجاح",
      });
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description:
          error?.data?.message ||
          (language === "en"
            ? "An error occurred while deleting"
            : "حدث خطأ أثناء الحذف"),
        variant: "destructive",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  // Don't render anything on the server
  if (!isClient) return null;

  // Don't render if product data is not available
  if (!product && IsModelOpen) return null;

  return (
    <Dialog open={IsModelOpen} onOpenChange={IsModelOpenChange}>
      <DialogContent className="lg:!max-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader
          className={`space-y-2 ${
            language === "en" ? "!text-left" : "!text-right"
          }`}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <DialogTitle className="flex justify-between text-2xl text-primary font-bold items-center">
            <div>
              {language === "en" ? "Edit Advertisement" : "تعديل الإعلان"}
            </div>
            <div className="text-primary text-xl">
              {product?.category_id === 1
                ? language === "en"
                  ? " (Car)"
                  : " (سيارة)"
                : product?.category_id === 2
                ? language === "en"
                  ? " (Motorcycle)"
                  : " (موتوسيكل)"
                : product?.category_id === 3
                ? language === "en"
                  ? " (Truck)"
                  : " (شاحنة)"
                : product?.category_id === 4
                ? language === "en"
                  ? " (Boat)"
                  : " (قارب)"
                : product?.category_id === 5
                ? language === "en"
                  ? " (Parts)"
                  : " (قطع غيار)"
                : product?.category_id === 6
                ? language === "en"
                  ? " (Car Number)"
                  : " (رقم سيارة)"
                : product?.category_id === 7
                ? language === "en"
                  ? " (Services)"
                  : " (خدمات)"
                : product?.category_id === 8
                ? language === "en"
                  ? " (Car Scrap and Accident)"
                  : " (سيارات اسكراب وحوادث)"
                : product?.category_id === 9
                ? language === "en"
                  ? " (Showroom)"
                  : " (معرض)"
                : ""}
            </div>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {language === "en"
              ? "Update your advertisement details below. All changes will be saved once you click Update."
              : "قم بتحديث تفاصيل إعلانك أدناه. سيتم حفظ جميع التغييرات بمجرد النقر على تحديث."}
          </DialogDescription>
          <Separator />
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              {language === "en"
                ? "Loading advertisement data..."
                : "جاري تحميل بيانات الإعلان..."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {/* Images Section */}
            <Card className="border-muted shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex text-lg font-semibold gap-2 items-center">
                  <ImagePlus className="h-5 text-primary w-5 mr-2" />
                  {language === "en" ? "Product Images" : "صور المنتج"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product?.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="bg-muted/20 border border-muted rounded-lg aspect-square group overflow-hidden relative"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${image.image}`}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="group-hover:scale-105 object-cover transition-transform"
                        />
                        <div className="bg-black/0 absolute duration-200 group-hover:bg-black/10 inset-0 transition-colors"></div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 rounded-full shadow-md w-8 absolute group-hover:opacity-100 opacity-0 right-2 top-2 transition-opacity"
                          onClick={() => deleteImage(image.id)}
                          disabled={
                            isLoadingDeleteImages ||
                            deletingImageId === image.id
                          }
                        >
                          {deletingImageId === image.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col bg-muted/10 border border-dashed justify-center rounded-lg items-center px-4 py-8">
                    <ImagePlus className="h-10 text-muted-foreground w-10 mb-3" />
                    <p className="text-center text-muted-foreground">
                      {language === "en"
                        ? "No images available for this product"
                        : "لا توجد صور متاحة لهذا المنتج"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Section */}
            <Card className="border-muted shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  {language === "en" ? "Product Details" : "تفاصيل المنتج"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleUpdate)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
                      {/* Brand & Model & Style */}
                      {product?.category_id === 1 ||
                      product?.category_id === 2 ||
                      product?.category_id === 3 ||
                      product?.category_id === 4 ||
                      product?.category_id === 8 ? (
                        <>
                          {/* Brand */}
                          {product?.category_id === 1 ||
                          product?.category_id === 2 ? (
                            <>
                              <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel className="font-medium">
                                      {language === "en" ? "Brand" : "الماركة"}
                                      <span className="text-destructive ml-1">
                                        *
                                      </span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        const selectedBrand = brandData.find(
                                          (brand: BrandType) =>
                                            brand.name_en === value
                                        );
                                        setBrandID(
                                          selectedBrand ? selectedBrand.id : 0
                                        );
                                        // Reset model when brand changes
                                        form.setValue("model", "");
                                        setModelID(0);
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                      disabled={isLoadingBrands}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              isLoadingBrands
                                                ? language === "en"
                                                  ? "Loading..."
                                                  : "جاري التحميل..."
                                                : language === "en"
                                                ? "Select brand"
                                                : "اختر الماركة"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {brandData.map((brand: BrandType) => (
                                          <SelectItem
                                            key={brand.id}
                                            value={
                                              language === "en"
                                                ? brand.name_en
                                                : brand.name_ar
                                            }
                                          >
                                            {language === "en"
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
                            </>
                          ) : (
                            <FormField
                              control={form.control}
                              name="brand"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="font-medium">
                                    {language === "en" ? "Brand" : "الماركة"}
                                    <span className="text-destructive ml-1">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      className="h-12"
                                      placeholder={
                                        language === "en"
                                          ? "Enter brand"
                                          : "أدخل الماركة"
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* SubCategory */}
                          {product?.category_id !== 1 && (
                            <FormField
                              control={form.control}
                              name="subSection"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="block">
                                    {language === "en" ? "Section" : "القسم"}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      const selectedSubSection =
                                        subSectionsData2.find(
                                          (subSection: SubSectionsType) =>
                                            subSection.name === value
                                        );
                                      setSubCategoryID(
                                        selectedSubSection
                                          ? selectedSubSection.id
                                          : 0
                                      );
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-12">
                                        <SelectValue
                                          placeholder={
                                            language === "en"
                                              ? "Select Section"
                                              : "اختر القسم"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {subSectionsData2.map(
                                        (subSection: SubSectionsType) => (
                                          <SelectItem
                                            key={subSection.id}
                                            value={subSection.name}
                                          >
                                            {subSection.name}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Condition */}
                          <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormLabel className="block">
                                    {language === "en" ? "Condition" : "الحالة"}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Force update the form value with all options
                                      form.setValue("condition", value, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                        shouldTouch: true,
                                      });
                                    }}
                                    value={field.value || ""}
                                    defaultValue={field.value || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-12">
                                        <SelectValue
                                          placeholder={
                                            language === "en"
                                              ? "Select Condition"
                                              : "اختر الحالة"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {condition.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={
                                            language === "en"
                                              ? item.value_en
                                              : item.value_ar
                                          }
                                        >
                                          {language === "en"
                                            ? item.name_en
                                            : item.name_ar}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />

                          {/* Year */}
                          {product?.standardSpecification?.some(
                            (spec) => spec.key === "manufacturing_year"
                          ) && (
                            <FormField
                              control={form.control}
                              name="year"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="font-medium">
                                    {language === "en"
                                      ? "Manufacturing Year"
                                      : "سنة الصنع"}
                                    <span className="text-destructive ml-1">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                                      min="0"
                                      onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e")
                                          e.preventDefault();
                                      }}
                                      placeholder={
                                        language === "en"
                                          ? "Enter year"
                                          : "أدخل السنة"
                                      }
                                      value={field.value?.toString() || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Mileage */}
                          {product?.standardSpecification?.some(
                            (spec) => spec.key === "mileage"
                          ) && (
                            <FormField
                              control={form.control}
                              name="mileage"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="font-medium">
                                    {language === "en"
                                      ? "Mileage"
                                      : "المسافة المقطوعة"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                                      min="0"
                                      onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e")
                                          e.preventDefault();
                                      }}
                                      placeholder={
                                        language === "en"
                                          ? "Enter mileage"
                                          : "أدخل المسافة"
                                      }
                                      value={field.value?.toString() || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Exterior Color */}
                          <FormField
                            control={form.control}
                            name="exteriorColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Exterior Color"
                                    : "اللون الخارجي"}
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
                                          language === "en"
                                            ? "Select Color"
                                            : "اختر اللون"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {colorName.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.value_en
                                            : item.value_ar
                                        }
                                      >
                                        {language === "en"
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
                          {product?.category_id !== 2 && (
                            <FormField
                              control={form.control}
                              name="interiorColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="block">
                                    {language === "en"
                                      ? "Interior Color"
                                      : "اللون الداخلي"}
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
                                            language === "en"
                                              ? "Select Color"
                                              : "اختر اللون"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {colorName.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={
                                            language === "en"
                                              ? item.value_en
                                              : item.value_ar
                                          }
                                        >
                                          {language === "en"
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
                          )}
                        </>
                      ) : (
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="font-medium">
                                {language === "en" ? "Name" : "الاسم"}
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  className="h-12"
                                  placeholder={
                                    language === "en"
                                      ? "Enter name"
                                      : "أدخل الاسم"
                                  }
                                  {...field}
                                  value={field.value?.toString() || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Car & Scrap */}
                      {(product?.category_id === 1 ||
                        product?.category_id === 8) && (
                        <>
                          {/* SpecificationsType */}
                          <FormField
                            control={form.control}
                            name="specificationsType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Specifications Type"
                                    : "المواصفات الاقليمية"}
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
                                          language === "en"
                                            ? "Select Specifications Type"
                                            : "اختر المواصفات الاقليمية"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {specificationsType.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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

                      {/* Car & Scrap & truck */}
                      {(product?.category_id === 1 ||
                        product?.category_id === 8 ||
                        product?.category_id === 3) && (
                        <>
                          {/* Model */}
                          {product?.category_id === 1 ||
                          product?.category_id === 8 ? (
                            <FormField
                              control={form.control}
                              name="model"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="font-medium">
                                    {language === "en" ? "Model" : "الموديل"}
                                    <span className="text-destructive ml-1">
                                      *
                                    </span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      const selectedModel = modelData.find(
                                        (model: ModelsType) =>
                                          model.name_en ||
                                          model.name_ar === value
                                      );
                                      setModelID(
                                        selectedModel ? selectedModel.id : 0
                                      );
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                    disabled={isLoadingModels || brandID === 0}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-12">
                                        <SelectValue
                                          placeholder={
                                            isLoadingModels
                                              ? language === "en"
                                                ? "Loading..."
                                                : "جاري التحميل..."
                                              : brandID === 0
                                              ? language === "en"
                                                ? "Select brand first"
                                                : "اختر الماركة أولاً"
                                              : language === "en"
                                              ? "Select model"
                                              : "اختر الموديل"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {modlesDataList.length > 0 ? (
                                        modlesDataList.map(
                                          (model: ModelsType) => (
                                            <SelectItem
                                              key={model.id}
                                              value={
                                                language === "en"
                                                  ? model.name_en
                                                  : model.name_ar
                                              }
                                            >
                                              {language === "en"
                                                ? model.name_en
                                                : model.name_ar}
                                            </SelectItem>
                                          )
                                        )
                                      ) : (
                                        <div className="p-2 text-center text-muted-foreground text-sm">
                                          {language === "en"
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
                          ) : (
                            <FormField
                              control={form.control}
                              name="model"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="font-medium">
                                    {language === "en" ? "Model" : "الموديل"}
                                    <span className="text-destructive ml-1">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      className="h-12"
                                      placeholder={
                                        language === "en"
                                          ? "Enter model"
                                          : "ادخل الموديل"
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Style */}
                          <FormField
                            control={form.control}
                            name="sub_category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Style (Optional)"
                                    : "الفئة او الطراز (اختياري)"}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    className="h-12"
                                    placeholder="SE, LE, Sport"
                                    {...field}
                                    value={field.value?.toString() || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Motion Vector */}
                          <FormField
                            control={form.control}
                            name="motion_vector"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="font-medium">
                                  {language === "en"
                                    ? "Transmission"
                                    : "ناقل الحركة"}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || "auto"}
                                  defaultValue={field.value || "auto"}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 focus:ring-2 focus:ring-primary/20 transition-all">
                                      <SelectValue
                                        placeholder={
                                          language === "en"
                                            ? "Select transmission"
                                            : "اختر ناقل الحركة"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="auto">
                                      {language === "en"
                                        ? "Automatic"
                                        : "أوتوماتيك"}
                                    </SelectItem>
                                    <SelectItem value="manual">
                                      {language === "en" ? "Manual" : "يدوي"}
                                    </SelectItem>
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
                                  {language === "en"
                                    ? "Fuel Type"
                                    : "نوع الوقود"}
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
                                          language === "en"
                                            ? "Select Fuel Type"
                                            : "اختر نوع الوقود"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {product?.category_id === 3
                                      ? fuelNameType
                                          .filter((item) => item.id !== 4)
                                          .map((item) => (
                                            <SelectItem
                                              key={item.id}
                                              value={
                                                language === "en"
                                                  ? item.value_en
                                                  : item.value_ar
                                              }
                                            >
                                              {language === "en"
                                                ? item.name_en
                                                : item.name_ar}
                                            </SelectItem>
                                          ))
                                      : fuelNameType.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                          {form.watch("fuelNameType") === "Electricity" ||
                          form.watch("fuelNameType") === "كهرباء" ? (
                            <>
                              {/* BatteryCapacity */}
                              <FormField
                                control={form.control}
                                name="batteryCapacity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="block">
                                      {language === "en"
                                        ? "battery capacity"
                                        : "سعة البطارية"}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("cylindersCount", "");
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              language === "en"
                                                ? "Select battery capacity"
                                                : "اختر سعة البطارية"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {BatteryCapacity.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                                      {language === "en"
                                        ? "Shipping duration"
                                        : "مدة الشحن"}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("cylindersCount", "");
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              language === "en"
                                                ? "Select the shipping duration"
                                                : "اختر مدة الشحن"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {ChargeDuration.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                                      {language === "en" ? "rate" : "النطاق"}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("cylindersCount", "");
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              language === "en"
                                                ? "Select a range rate"
                                                : "اختر معدل النطاق"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {ChargeRange.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                                      {language === "en"
                                        ? "Self driving"
                                        : "قيادة ذاتية"}

                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("cylindersCount", "");
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              language === "en"
                                                ? "Select self driving"
                                                : "اختر القيادة الذاتية"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {SelfDriving.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                                      {language === "en"
                                        ? "Cylinders Count"
                                        : "عدد الاسطوانات"}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("selfDriving", "");
                                        form.setValue("chargeRange", "");
                                        form.setValue("batteryCapacity", "");
                                        form.setValue("chargeDuration", "");
                                      }}
                                      value={field.value}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12">
                                          <SelectValue
                                            placeholder={
                                              language === "en"
                                                ? "Select Cylinders Count"
                                                : "اختر عدد الاسطوانات"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {cylindersCount.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={
                                              language === "en"
                                                ? item.value_en
                                                : item.value_ar
                                            }
                                          >
                                            {language === "en"
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
                          {product?.category_id !== 3 && (
                            <FormField
                              control={form.control}
                              name="structureType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="block">
                                    {language === "en"
                                      ? "Structure Type"
                                      : "نوع الهيكل"}
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
                                            language === "en"
                                              ? "Select Structure Type"
                                              : "اختر نوع الهيكل"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {structureType.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={
                                            language === "en"
                                              ? item.name_en
                                              : item.name_ar
                                          }
                                        >
                                          {language === "en"
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
                          )}

                          {/* EnginCount */}
                          <FormField
                            control={form.control}
                            name="enginCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Engine Count"
                                    : " سعة المحرك (سي سي)"}
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
                                          language === "en"
                                            ? "Select Engine Count"
                                            : "اختر سعة المحرك"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {enginCount.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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
                                  {language === "en"
                                    ? "Horse Power"
                                    : "قوة الحصان"}
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
                                          language === "en"
                                            ? "Select Horse Power"
                                            : "اختر قوة الحصان"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {horsePower.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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
                          {product?.category_id !== 3 && (
                            <FormField
                              control={form.control}
                              name="numOfSeatsName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="block">
                                    {language === "en"
                                      ? "Number Of Seats"
                                      : "عدد المقاعد"}
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
                                            language === "en"
                                              ? "Select Number Of Seats"
                                              : "اختر عدد المقاعد"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {numOfSeatsName.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={
                                            language === "en"
                                              ? item.name_en
                                              : item.name_ar
                                          }
                                        >
                                          {language === "en"
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
                          )}
                        </>
                      )}

                      {/* MotorCycle */}
                      {product?.category_id === 2 && (
                        <>
                          {/* Power Transmission System */}
                          <FormField
                            control={form.control}
                            name="powerTransmissionSystem"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Power Transmission System"
                                    : "نظام نقل القدرة"}
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
                                          language === "en"
                                            ? "Select Power Transmission System"
                                            : "اختر نظام نقل القدرة"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {PowerTransmissionSystemType.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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

                          {/* Bike Engine Size */}
                          <FormField
                            control={form.control}
                            name="bikeEngineSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Engine Size"
                                    : "حجم المحرك"}
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
                                          language === "en"
                                            ? "Select Engine Size"
                                            : "اختر حجم المحرك"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bikeEngineSize.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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

                          {/* NumberOfTiresOfBicks */}
                          <FormField
                            control={form.control}
                            name="numberOfTiresOfBicks"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Number of Tires"
                                    : "عدد الإطارات"}
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
                                          language === "en"
                                            ? "Select Number of Tires"
                                            : "اختر عدد الإطارات"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {NumberOfTiresOfBicks.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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

                      {/* Truck */}
                      {product?.category_id === 3 && (
                        <>
                          {/* TheWeight */}
                          <FormField
                            control={form.control}
                            name="theWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en" ? "Weight" : "الوزن"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder={
                                      language === "en"
                                        ? "Enter weight"
                                        : "ادخل الوزن"
                                    }
                                    className="h-12"
                                    value={field.value?.toString() || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Boat */}
                      {product?.category_id === 4 && (
                        <>
                          {/* The Age */}
                          <FormField
                            control={form.control}
                            name="theAge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en" ? "Age" : "العمر"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="h-12"
                                    placeholder={
                                      language === "en"
                                        ? "Enter age"
                                        : "ادخل العمر"
                                    }
                                    {...field}
                                    value={field.value?.toString() || ""}
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
                                  {language === "en" ? "Height" : "الطول"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="h-12"
                                    placeholder={
                                      language === "en"
                                        ? "Enter height"
                                        : "ادخل الطول"
                                    }
                                    {...field}
                                    value={field.value?.toString() || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Auto Parts */}
                      {product?.category_id === 5 && (
                        <>
                          {/* Type */}
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en" ? "Type" : "النوع"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedType = autoPartsData2.find(
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      (type: any) => type.name_en === value
                                    );
                                    setTypeID(
                                      selectedType ? selectedType.id : 0
                                    );
                                  }}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue
                                        placeholder={
                                          language === "en"
                                            ? "Select type"
                                            : "اختر النوع"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {autoPartsData2.map((subSection: any) => (
                                      <SelectItem
                                        key={subSection.id}
                                        value={
                                          (language === "en"
                                            ? subSection.name_en
                                            : subSection.name_ar) || ""
                                        }
                                      >
                                        {language === "en"
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
                                  {language === "en" ? "Section" : "القسم"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedType =
                                      autoPartsDataCategory2.find(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (type: any) =>
                                          language === "en"
                                            ? type.name_en === value
                                            : type.name_ar === value
                                      );
                                    setTypeCategoryID(
                                      selectedType ? selectedType.id : 0
                                    );
                                  }}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue
                                        placeholder={
                                          language === "en"
                                            ? "Select section"
                                            : "اختر القسم"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {autoPartsDataCategory2.map(
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      (subSection: any) => (
                                        <SelectItem
                                          key={subSection.id}
                                          value={
                                            language === "en"
                                              ? subSection.name_en || ""
                                              : subSection.name_ar || ""
                                          }
                                        >
                                          {language === "en"
                                            ? subSection.name_en
                                            : subSection.name_ar}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Services */}
                      {product?.category_id === 7 && (
                        <>
                          {/* SubCategoryServices */}
                          <FormField
                            control={form.control}
                            name="subSectionServices"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en" ? "Section" : "القسم"}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Force update the form value to ensure it's registered
                                    form.setValue("subSectionServices", value, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                      shouldTouch: true,
                                    });
                                  }}
                                  value={field.value || ""}
                                  defaultValue={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue
                                        placeholder={
                                          language === "en"
                                            ? "Select section"
                                            : "اختر القسم"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SubSectionsServicesType.map(
                                      (subSection) => (
                                        <SelectItem
                                          key={subSection.id}
                                          value={
                                            (language === "en"
                                              ? subSection.name_en
                                              : subSection.name_ar) || ""
                                          }
                                        >
                                          {language === "en"
                                            ? subSection.name_en
                                            : subSection.name_ar}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {product?.category_id !== 9 && (
                        <>
                          {/* Price */}
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="font-medium">
                                  {language === "en" ? "Price" : "السعر ب "}(
                                  {product?.country?.symbol})
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    className="h-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
                                    min="0"
                                    onKeyDown={(e) => {
                                      if (e.key === "-" || e.key === "e")
                                        e.preventDefault();
                                    }}
                                    placeholder={
                                      language === "en"
                                        ? "Enter price"
                                        : "أدخل السعر"
                                    }
                                    value={field.value?.toString() || ""}
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
                              <FormItem className="space-y-2">
                                <FormLabel className="font-medium">
                                  {language === "en"
                                    ? "Ad Type"
                                    : "نوع الإعلان"}
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  value={field.value || ""}
                                  defaultValue={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue
                                        placeholder={
                                          language === "en"
                                            ? "Select type"
                                            : "اختر النوع"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {conditionPriceType.map((type) => (
                                      <SelectItem
                                        key={type.id}
                                        value={type.value_en}
                                      >
                                        {language === "en"
                                          ? type.name_en
                                          : type.name_ar}
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

                      {/* Warranty & Delivery Service*/}
                      {product?.category_id === 1 ||
                      product?.category_id === 2 ||
                      product?.category_id === 3 ||
                      product?.category_id === 4 ||
                      product?.category_id === 8 ? (
                        <>
                          {/* Warranty  */}
                          <FormField
                            control={form.control}
                            name="warranty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en" ? "Warranty" : "الضمان"}

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
                                          language === "en"
                                            ? "Select Warranty"
                                            : "اختر الضمان"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {WarrantyType.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.value}
                                      >
                                        {language === "en"
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
                          {/* Delivery Service  */}
                          <FormField
                            control={form.control}
                            name="deliveryService"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block">
                                  {language === "en"
                                    ? "Delivery Service"
                                    : "خدمة التوصيل"}

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
                                          language === "en"
                                            ? "Select Delivery Service"
                                            : "اختر خدمة التوصيل"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {deliveryService.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={
                                          language === "en"
                                            ? item.name_en
                                            : item.name_ar
                                        }
                                      >
                                        {language === "en"
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

                      {/* Address */}
                      {product?.address && (
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="font-medium">
                                {language === "en" ? "Address" : "العنوان"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-12 focus:ring-2 focus:ring-primary/20 transition-all"
                                  placeholder={
                                    language === "en"
                                      ? "Enter address"
                                      : "أدخل العنوان"
                                  }
                                  value={field.value?.toString() || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Description */}
                    <div className="col-span-full">
                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="font-medium">
                              {language === "en" ? "Description" : "الوصف"}
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                className="bg-background border border-input p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] transition-all"
                                placeholder={
                                  language === "en"
                                    ? "Enter product description"
                                    : "أدخل وصف المنتج"
                                }
                                value={field.value?.toString() || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="flex justify-center gap-4 pt-4 sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => IsModelOpenChange(false)}
                        className="h-12 font-medium px-6"
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoadingUpdate}
                        className="bg-primary h-12 text-base font-medium hover:bg-primary/90 px-8"
                      >
                        {isLoadingUpdate ? (
                          <div className="flex items-center">
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                            {language === "en"
                              ? "Updating..."
                              : "جاري التحديث..."}
                          </div>
                        ) : language === "en" ? (
                          "Update Advertisement"
                        ) : (
                          "تحديث الإعلان"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAdvertisementModel;
