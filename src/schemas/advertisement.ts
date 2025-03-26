import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const formSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  iso_code: z.string(),
  phone: z
    .string()
    .min(9, "رقم الهاتف يجب أن يكون 9 أرقام على الأقل")
    .max(15, "رقم الهاتف يجب أن لا يتجاوز 15 رقم"),
  country: z.string().min(1, { message: "الدولة مطلوبة" }),
  city: z.string().min(1, { message: "المدينة مطلوبة" }),
  address: z.string().min(1, { message: "العنوان مطلوب" }),
  mainImage: z
    .custom<File>((value) => value instanceof File, {
      message: "الصورة الرئيسية مطلوبة",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `الحد الأقصى لحجم الملف هو 10 ميجابايت`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "يُقبل فقط .jpg, .jpeg, .png و .webp"
    ),
  additionalImages: z
    .array(
      z
        .custom<File>((value) => value instanceof File, {
          message: "يجب أن يكون ملف صورة صالح",
        })
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `الحد الأقصى لحجم الملف هو 10 ميجابايت`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "يُقبل فقط .jpg, .jpeg, .png و .webp"
        )
    )
    .max(20, "يمكنك إضافة حتى 20 صورة إضافية")
    .optional(),
  whatsappPreferred: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const CarFormSchema = z.object({
  brand: z.string().min(1, {
    message: "الماركة مطلوبة",
  }),
  model: z.string().min(1, {
    message: "الموديل مطلوب",
  }),
  style: z.string(),
  year: z
    .string()
    .min(4, {
      message: "سنة الصنع يجب أن تكون 4 أرقام",
    })
    .max(4, {
      message: "سنة الصنع يجب أن تكون 4 أرقام",
    }),
  mileage: z.string().min(1, {
    message: "المسافة المقطوعة مطلوبة",
  }),
  price: z.string().min(3, {
    message: "السعر مطلوب",
  }),
  specificationsType: z.string().min(1, {
    message: "المواصفات مطلوبة",
  }),
  fuelNameType: z.string().min(1, {
    message: "نوع الوقود مطلوب",
  }),
  cylindersCount: z.string().optional(),
  batteryCapacity: z.string().optional(),
  chargeDuration: z.string().optional(),
  chargeRange: z.string().optional(),
  selfDriving: z.string().optional(),
  structureType: z.string().min(1, {
    message: "نوع الهيكل مطلوب",
  }),
  enginCount: z.string().min(1, {
    message: "سعة المحرك مطلوبة",
  }),
  horsePower: z.string().min(1, {
    message: "قوة الحصان مطلوبة",
  }),
  exteriorColor: z.string().min(1, {
    message: "اللون الخارجي مطلوب",
  }),
  interiorColor: z.string().min(1, {
    message: "اللون الداخلي مطلوب",
  }),
  condition: z.string().min(1, {
    message: "الحالة مطلوبة",
  }),
  numOfSeatsName: z.string().min(1, {
    message: "عدد المقاعد مطلوب",
  }),
  transmissionType: z.string().min(1, {
    message: "نوع التحكم مطلوب",
  }),
  conditionPrice: z.string().min(1, {
    message: "نوع الاعلان مطلوب",
  }),
  warranty: z.string().min(1, { message: "الضمان مطلوب" }),
  description: z.string().optional(),
});

export const MotoFormSchema = z.object({
  subCategory: z
    .string({
      required_error: "القسم الفرعي مطلوب",
    })
    .min(1, { message: "القسم الفرعي مطلوب" }),

  brand: z
    .string({
      required_error: "الماركة مطلوبة",
    })
    .min(1, { message: "الماركة مطلوبة" }),

  year: z
    .string({
      required_error: "سنة الصنع مطلوبة",
    })
    .min(4, { message: "سنة الصنع يجب أن تكون 4 أرقام" })
    .max(4, { message: "سنة الصنع يجب أن تكون 4 أرقام" }),

  mileage: z
    .string({
      required_error: "المسافة المقطوعة مطلوبة",
    })
    .min(1, { message: "المسافة المقطوعة مطلوبة" }),

  price: z.string().min(3, {
    message: "السعر مطلوب",
  }),

  powerTransmissionSystem: z
    .string({
      required_error: "ناقل الحركة مطلوب",
    })
    .min(1, { message: "ناقل الحركة مطلوب" }),

  bikeEngineSize: z
    .string({
      required_error: "سعة المحرك مطلوبة",
    })
    .min(1, { message: "سعة المحرك مطلوبة" }),

  numberOfTiresOfBicks: z
    .string({
      required_error: "عدد الإطارات مطلوب",
    })
    .min(1, { message: "عدد الإطارات مطلوب" }),

  exteriorColor: z
    .string({
      required_error: "اللون الخارجي مطلوب",
    })
    .min(1, { message: "اللون الخارجي مطلوب" }),

  condition: z
    .string({
      required_error: "الحالة مطلوبة",
    })
    .min(1, { message: "الحالة مطلوبة" }),

  conditionPrice: z
    .string({
      required_error: "نوع الإعلان مطلوب",
    })
    .min(1, { message: "نوع الإعلان مطلوب" }),

  warranty: z
    .string({
      required_error: "الضمان مطلوب",
    })
    .min(1, { message: "الضمان مطلوب" }),

  description: z.string().optional(),
});

export const TrackFormSchema = z.object({
  Subsection: z.string().min(1, { message: "القسم مطلوب" }),
  brand: z.string().min(1, { message: "الماركة مطلوبة" }),
  model: z.string().min(1, { message: "الماركة مطلوبة" }),
  manufacturingYear: z.string().min(4, { message: "سنة الصنع مطلوبة" }),
  mileage: z.string().min(3, { message: "المسافة المقطوعة مطلوبة" }),
  price: z.string().min(3, { message: "السعر مطلوب" }),
  fuelType: z.string().min(1, { message: "نوع الوقود مطلوب" }),
  cylindersCount: z.string().optional(),
  horsePower: z.string().min(1, { message: "قوة الحصان مطلوبة" }),
  exteriorColor: z.string().min(1, { message: "اللون الخارجي مطلوب" }),
  interiorColor: z.string().min(1, { message: "اللون الداخلي مطلوب" }),
  engineCount: z.string().min(1, { message: "سعة المحرك مطلوبة" }),
  theWeight: z.string().min(1, { message: "الوزن مطلوب" }),
  condition: z.string().min(1, { message: "الحالة مطلوبة" }),
  conditionPrice: z.string().min(1, { message: "نوع الاعلان مطلوب" }),
  Warranty: z.string().min(1, { message: "الضمان مطلوب" }),
  description: z.string().optional(),
});

export const BoatFormSchema = z.object({
  Subsection: z.string().min(1, { message: "القسم مطلوب" }),
  brand: z.string().min(1, { message: "الماركة مطلوبة" }),
  price: z.string().min(3, { message: "السعر مطلوب" }),
  theAge: z.string().min(1, { message: "العمر مطلوب" }),
  theHeight: z.string().min(1, { message: "الطول مطلوب" }),
  exteriorColor: z.string().min(1, { message: "اللون الخارجي مطلوب" }),
  interiorColor: z.string().min(1, { message: "اللون الداخلي مطلوب" }),
  condition: z.string().min(1, { message: "الحالة مطلوبة" }),
  conditionPrice: z.string().min(1, { message: "نوع الاعلان مطلوب" }),
  Warranty: z.string().min(1, { message: "الضمان مطلوب" }),
  description: z.string().optional(),
});

export const ServicesFormSchema = z.object({
  subSectionServices: z.string().min(1, { message: "القسم مطلوب" }),
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  price: z.string().min(3, { message: "السعر مطلوب" }),
  conditionPrice: z.string().min(1, { message: "نوع الاعلان مطلوب" }),
  deliveryService: z.string().min(1, { message: "خدمة التوصيل مطلوبة" }),
  description: z.string().optional(),
});

export const SparePartsFormSchema = z.object({
  type: z.string().min(1, { message: "النوع مطلوب" }),
  section: z.string().min(1, { message: "القسم مطلوب" }),
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  price: z.string().min(3, { message: "السعر مطلوب" }),
  conditionPrice: z.string().min(1, { message: "نوع الاعلان مطلوب" }),
  deliveryService: z.string().min(1, { message: "خدمة التوصيل مطلوبة" }),
  description: z.string().optional(),
});

export const CarNumberFormSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  price: z.string().min(3, { message: "السعر مطلوب" }),
  conditionPrice: z.string().min(1, { message: "نوع الاعلان مطلوب" }),
  deliveryService: z.string().min(1, { message: "خدمة التوصيل مطلوبة" }),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type CarFormValues = z.infer<typeof CarFormSchema>;
export type MotoFormValues = z.infer<typeof MotoFormSchema>;
export type TrackFormValues = z.infer<typeof TrackFormSchema>;
export type BoatFormValues = z.infer<typeof BoatFormSchema>;
export type ServicesFormValues = z.infer<typeof ServicesFormSchema>;
export type SparePartsFormValues = z.infer<typeof SparePartsFormSchema>;
export type CarNumberFormValues = z.infer<typeof CarNumberFormSchema>;
