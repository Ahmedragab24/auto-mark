import AsideSupport from "@/components/AsideSupport";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Mark | شراء وبيع السيارات والمركبات في الوطن العربي",
  description:
    "Auto Mark هو وجهتك الأولى لشراء وبيع السيارات، الموتسيكلات، القوارب، الشاحنات، وقطع الغيار في الوطن العربي. نوفر خدمات السيارات المتكاملة ومعارض السيارات الموثوقة لتلبية جميع احتياجاتك.",
  keywords: [
    "شراء سيارات",
    "بيع سيارات",
    "سيارات مستعملة",
    "موتسيكلات للبيع",
    "قوارب للبيع",
    "شاحنات للبيع",
    "قطع غيار سيارات",
    "خدمات السيارات",
    "معارض سيارات",
    "موقع سيارات في الوطن العربي",
    "أفضل أسعار السيارات",
    "تأجير سيارات",
    "شراء سيارات جديدة",
    "معارض سيارات مستعملة",
  ],
  robots: "index, follow",
  icons: "/Logo/Logo.png",
};

export default function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-secondary mt-36">
      <div className="container w-full pt-10">
        <Breadcrumbs />
      </div>

      <main className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-[240px,1fr] gap-4">
          <AsideSupport />

          {children}
        </div>
      </main>
    </div>
  );
}
