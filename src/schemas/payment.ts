import { z } from "zod";

export const FormSchema = z.object({
  type: z.enum(["creditCard", "paypal"], {
    required_error: "يجب اختيار طريقة الدفع.",
  }),
  cardName: z.string().min(1, "اسم البطاقة مطلوب"),
  cardNumber: z.string().regex(/^\d{16}$/, "رقم البطاقة غير صالح"),
  cvv: z.string().regex(/^\d{3}$/, "الرقم السري غير صالح"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "تاريخ الانتهاء غير صالح"),
  saveCard: z.boolean().default(false),
});
