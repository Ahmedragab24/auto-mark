import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import ScrollUp from "@/components/layout/ScrollUp";
import Script from "next/script";

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
    <html lang="ar" dir="Rtl" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17263694454"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-17263694454');
  `}
        </Script>

        <Script id="conversion" strategy="afterInteractive">
          {`
    gtag('event', 'conversion', {'send_to': 'AW-17263694454/g8SACJS5oOIaEPak_KdA'});
  `}
        </Script>
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
