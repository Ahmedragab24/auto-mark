import { z } from "zod";

export const loginSchema = z.object({
  iso_code: z.string(),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .regex(/^\d+$/, "رقم الهاتف غير صحيح")
    .min(9, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً"),
  password: z.string({ required_error: "كلمة المرور مطلوبة" }),
  fcm: z.string(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن لا يتجاوز 50 حرف"),
  login_type: z.enum(["normal", "google", "apple"]),
  iso_code: z.string(),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .regex(/^\d+$/, "رقم الهاتف غير صحيح")
    .min(9, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),
  type: z.enum(["user", "showroom", "vendor"]),
  // latitude: z.any(),
  // longitude: z.any(),
  // device_id: z.any(),
  // fcm: z.any(),
  // confirmPassword: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "كلمة المرور غير متطابقة",
//   path: ["confirmPassword"],
// });

export const SendCoderSchema = z.object({
  iso_code: z.string(),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .regex(/^\d+$/, "رقم الهاتف غير صحيح")
    .min(9, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً"),
});

export const addAddressSchema = z.object({
  country: z.string({
    required_error: "يرجى اختيار الدولة",
  }),
  city: z.string({
    required_error: "يرجى اختيار المدينة",
  }),
  address: z
    .string({
      required_error: "يرجى إدخال العنوان",
    })
    .min(10, "العنوان قصير جداً"),
  iso_code: z.string({
    required_error: "يرجى اختيار رمز الدولة",
  }),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .regex(/^\d+$/, "رقم الهاتف غير صحيح")
    .min(9, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً"),
});

export const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "رقم البطاقة يجب أن يكون 16 رقم")
    .max(19, "رقم البطاقة غير صحيح")
    .regex(/^[\d\s-]+$/, "رقم البطاقة يجب أن يحتوي على أرقام فقط"),
  cardHolder: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(50, "الاسم طويل جداً"),
  cvv: z
    .string()
    .min(3, "الرقم السري يجب أن يكون 3 أرقام")
    .max(3, "الرقم السري يجب أن يكون 3 أرقام")
    .regex(/^\d+$/, "الرقم السري يجب أن يحتوي على أرقام فقط"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "تاريخ غير صحيح (MM/YY)"),
  saveCard: z.boolean().default(false),
});

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم طويل جداً"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  iso_code: z.string(),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .regex(/^\d+$/, "رقم الهاتف غير صحيح")
    .min(9, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً"),
  login_type: z.string(),
  type: z.string(),
  country_id: z.number(),
});

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
    new_password: z.string().min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
    new_password_confirmation: z
      .string()
      .min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمة المرور غير متطابقة",
    path: ["new_password_confirmation"],
  });

export const changePasswordOTPSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
    newPassword: z.string().min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
    confirmPassword: z
      .string()
      .min(8, "يجب ان تكون كلمة المرور اكثر من 8 احرف"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  phone: z.string(),
  key: z.string(),
  otp: z.string().length(6, "يجب إدخال جميع الأرقام"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SendCoderFormData = z.infer<typeof SendCoderSchema>;
export type AddAddressFormData = z.infer<typeof addAddressSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PasswordFormValues = z.infer<typeof changePasswordSchema>;
export type PasswordFormOTPValues = z.infer<typeof changePasswordSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;
