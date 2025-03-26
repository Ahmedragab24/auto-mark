"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useContactMutation } from "@/store/apis/contact";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hooks";

export default function ContactForm() {
  const { toast } = useToast();
  const [contact, { isLoading }] = useContactMutation();
  const {
    UserData: { user },
    Language: { language },
  } = useAppSelector((state: RootState) => state);

  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await contact({
        name: formData.name,
        email: user.email || "_",
        phone: user.phone || "",
        subject: "_", // As per the API implementation
        message: formData.message,
      }).unwrap();

      toast({
        title: language === "en" ? "Message sent" : "تم ارسال الرسالة",
        description:
          language === "en"
            ? "Thank you for your message. We will get back to you soon."
            : "شكرا لرسالتك. سنتواصل معك قريباً.",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        message: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.data?.message ||
        "Failed to send message. Please try again later.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">{language === "en" ? "Name" : "الاسم"}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={language === "en" ? "Enter your name" : "ادخل اسمك"}
            required
            className="mt-1 h-12"
          />
        </div>

        <div>
          <Label htmlFor="message">
            {language === "en" ? "Message" : "الرسالة"}
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={
              language === "en" ? "Enter your message" : "ادخل رسالتك"
            }
            required
            className="mt-1 min-h-[180px] p-4"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === "en" ? "Sending..." : "جاري الإرسال..."}
          </>
        ) : language === "en" ? (
          "Send Message"
        ) : (
          "إرسال الرسالة"
        )}
      </Button>
    </form>
  );
}
