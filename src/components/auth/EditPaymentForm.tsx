"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { paymentFormSchema, PaymentFormValues } from "@/schemas";
import { useRouter } from "next/navigation";

export default function EditPaymentForm() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      cvv: "",
      expiryDate: "",
      saveCard: false,
    },
  });
  const router = useRouter();

  function onSubmit(data: PaymentFormValues) {
    console.log(data);
    /**
     * Resolver function to validate the form values against the schema
     */
    // Handle form submission
  }

  return (
    <Card className="w-full px-4 py-8 mx-auto md:px-8 lg:px-28 xl:px-40">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            dir="rtl"
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">رقم البطاقة *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 1234 1234 1234"
                      className="h-12 text-right"
                      {...field}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, "");
                        const formatted =
                          value.match(/.{1,4}/g)?.join(" ") || value;
                        field.onChange(formatted);
                      }}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">
                    الاسم على البطاقة *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اسم صاحب البطاقة"
                      className="h-12 text-right"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">الرقم السري</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        className="h-12 text-right"
                        maxLength={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">
                      تاريخ الانتهاء *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        className="h-12 text-right"
                        {...field}
                        onChange={(e) => {
                          // Format expiry date
                          const value = e.target.value.replace(/\D/g, "");
                          const formatted =
                            value.length > 2
                              ? `${value.slice(0, 2)}/${value.slice(2, 4)}`
                              : value;
                          field.onChange(formatted);
                        }}
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="saveCard"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-right">
                    حفظ معلومات البطاقة
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      dir="ltr"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => router.back()}
              >
                العودة
              </Button>
              <Button type="submit" className="w-full">
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
