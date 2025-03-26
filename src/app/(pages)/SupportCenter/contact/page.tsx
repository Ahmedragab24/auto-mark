"use client";

import ContactForm from "@/components/ContactForm";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

const ContactPage = () => {
  const {
    Language: { language },
  } = useAppSelector((state: RootState) => state);

  return (
    <div className="container mx-auto py-16 px-6 md:px-14 bg-background rounded-xl">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {language === "en" ? "Contact Us" : "اتصل بنا"}
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          {language === "en"
            ? "Fill out the form below to send us a message. We'll get back to you as soon as possible."
            : "املأ النموذج أدناه لإرسال رسالة إلينا. سنتواصل معك في أقرب وقت ممكن."}
        </p>

        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
