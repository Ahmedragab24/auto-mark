import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import ScrollUp from "@/components/layout/ScrollUp";

const geistSans = Alexandria({
  variable: "--font-alexandria-sans",
  subsets: ["arabic"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="RtL"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Header />
            {children}
            <Toaster />
            <Footer />
            <ScrollUp />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
