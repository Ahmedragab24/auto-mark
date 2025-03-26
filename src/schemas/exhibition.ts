import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const registrationSchema = z
  .object({
    logo: z.object({
      file: z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `حجم الملف يجب أن يكون أقل من 5 ميجابايت`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "يجب أن يكون الملف بصيغة .jpg, .jpeg, .png or .webp"
        ),
      preview: z.string(),
    }),
    background_image: z.object({
      file: z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `حجم الملف يجب أن يكون أقل من 5 ميجابايت`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "يجب أن يكون الملف بصيغة .jpg, .jpeg, .png or .webp"
        ),
      preview: z.string(),
    }),
    country: z.string({
      required_error: "يرجى اختيار الدولة",
    }),
    name_en: z
      .string({
        required_error: "يرجى إدخال الاسم المعروض",
      })
      .min(3, "الاسم المعروض يجب أن يكون على الأقل 3 أحرف"),
    name_ar: z
      .string({
        required_error: "يرجى إدخال الاسم المعروض",
      })
      .min(3, "الاسم المعروض يجب أن يكون على الأقل 3 أحرف"),
    city: z.string({
      required_error: "يرجى اختيار المدينة",
    }),
    specialization: z.string({
      required_error: "يرجى اختيار التخصص",
    }),
    phone: z
      .string({
        required_error: "يرجى إدخال رقم الهاتف",
      })
      .regex(/^\d+$/, "رقم الهاتف غير صحيح"),
    iso_code: z.string({
      required_error: "يرجى اختيار رمز الدولة",
    }),
    email: z
      .string({
        required_error: "يرجى إدخال البريد الإلكتروني",
      })
      .email("البريد الإلكتروني غير صحيح"),
    password: z
      .string({
        required_error: "يرجى إدخال كلمة المرور",
      })
      .min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    confirmPassword: z.string({
      required_error: "يرجى تأكيد كلمة المرور",
    }),
    description: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;
