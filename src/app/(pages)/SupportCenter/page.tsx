"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useGetFaqsQuery } from "@/store/apis/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionFaqs {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

const Page = () => {
  const {
    Language: { language },
  } = useAppSelector((state: RootState) => state);
  const { data } = useGetFaqsQuery("");
  const FaqsData = data?.data?.faqs?.data;
  const [isClient, setIsClient] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className="container mx-auto py-16 px-6 md:px-14 bg-background rounded-xl"
      dir="auto"
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        {language === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
      </h1>
      <Accordion
        type="single"
        collapsible
        value={activeItem || ""}
        onValueChange={setActiveItem}
        className="grid md:grid-cols-2 gap-6"
      >
        {FaqsData?.map((faq: AccordionFaqs) => (
          <AccordionItem
            key={faq.id}
            value={`item-${faq.id}`}
            className="border-b"
          >
            <AccordionTrigger className="text-lg font-medium transition-all hover:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Page;
