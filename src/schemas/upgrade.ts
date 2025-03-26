import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const upgradeSchema = z.object({
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
  nameAr: z
    .string({
      required_error: "يرجى إدخال الاسم المعروض",
    })
    .min(2, "الاسم المعروض يجب أن يكون على الأقل 2 أحرف"),
  nameEn: z
    .string({
      required_error: "يرجى إدخال الاسم المعروض",
    })
    .min(2, "الاسم المعروض يجب أن يكون على الأقل 2 أحرف"),
  city: z.string({
    required_error: "يرجى اختيار المدينة",
  }),
  specialization: z.string({
    required_error: "يرجى اختيار التخصص",
  }),

  description: z.string().optional(),
});

export const updateShowroomSchema = z.object({
  logo: z
    .object({
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
    })
    .optional(), // جعل الحقل اختيارياً

  background_image: z
    .object({
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
    })
    .optional(), // جعل الحقل اختيارياً

  country: z.string().optional(),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  city: z.string().optional(),
  specialization: z.string().optional(),
  description: z.string().optional(),
});

export type UpgradeValues = z.infer<typeof upgradeSchema>;
export type UpdateShowroomValues = z.infer<typeof updateShowroomSchema>;
