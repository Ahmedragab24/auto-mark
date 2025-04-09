import {
  CategoryCarsType,
  navigationLinkType,
  ServicesSectionType,
} from "@/types";

export const navigationLink: navigationLinkType[] = [
  { title_ar: "الرئيسية", title_en: "Home", href: "/" },
  { title_ar: "الأقسام", title_en: "Categories", href: "/categories" },
  { title_ar: "إعلاناتي", title_en: "My Ads", href: "/advertisement" },
];

export const country = [
  { name: "السعودية", value: "SAU" },
  { name: "البحرين", value: "BHR" },
  { name: "الإمارات", value: "ARE" },
  { name: "عمان", value: "OMN" },
  { name: "مصر", value: "EGY" },
];

export const arabCountries = [
  {
    name: "الإمارات",
    code: "AE",
    dialCode: "+971",
    flag: "https://flagcdn.com/w320/ae.png",
  },
  {
    name: "السعودية",
    code: "SA",
    dialCode: "+966",
    flag: "https://flagcdn.com/w320/sa.png",
  },
  {
    name: "مصر",
    code: "EG",
    dialCode: "+20",
    flag: "https://flagcdn.com/w320/eg.png",
  },
  {
    name: "قطر",
    code: "QA",
    dialCode: "+974",
    flag: "https://flagcdn.com/w320/qa.png",
  },
  {
    name: "الكويت",
    code: "KW",
    dialCode: "+965",
    flag: "https://flagcdn.com/w320/kw.png",
  },
  {
    name: "البحرين",
    code: "BH",
    dialCode: "+973",
    flag: "https://flagcdn.com/w320/bh.png",
  },
  {
    name: "عمان",
    code: "OM",
    dialCode: "+968",
    flag: "https://flagcdn.com/w320/om.png",
  },
  {
    name: "العراق",
    code: "IQ",
    dialCode: "+964",
    flag: "https://flagcdn.com/w320/iq.png",
  },
  {
    name: "الأردن",
    code: "JO",
    dialCode: "+962",
    flag: "https://flagcdn.com/w320/jo.png",
  },
  {
    name: "لبنان",
    code: "LB",
    dialCode: "+961",
    flag: "https://flagcdn.com/w320/lb.png",
  },
  {
    name: "اليمن",
    code: "YE",
    dialCode: "+967",
    flag: "https://flagcdn.com/w320/ye.png",
  },
  {
    name: "سوريا",
    code: "SY",
    dialCode: "+963",
    flag: "https://flagcdn.com/w320/sy.png",
  },
  {
    name: "السودان",
    code: "SD",
    dialCode: "+249",
    flag: "https://flagcdn.com/w320/sd.png",
  },
  {
    name: "ليبيا",
    code: "LY",
    dialCode: "+218",
    flag: "https://flagcdn.com/w320/ly.png",
  },
  {
    name: "تونس",
    code: "TN",
    dialCode: "+216",
    flag: "https://flagcdn.com/w320/tn.png",
  },
  {
    name: "الجزائر",
    code: "DZ",
    dialCode: "+213",
    flag: "https://flagcdn.com/w320/dz.png",
  },
  {
    name: "المغرب",
    code: "MA",
    dialCode: "+212",
    flag: "https://flagcdn.com/w320/ma.png",
  },
];

export const cities = {
  AE: [
    { name: "أبو ظبي", value: "abudhabi" },
    { name: "دبي", value: "dubai" },
    { name: "الشارقة", value: "sharjah" },
    { name: "العين", value: "alain" },
    { name: "عجمان", value: "ajman" },
  ],
  SA: [
    { name: "الرياض", value: "riyadh" },
    { name: "جدة", value: "jeddah" },
    { name: "الدمام", value: "dammam" },
    { name: "مكة المكرمة", value: "mecca" },
    { name: "المدينة المنورة", value: "medina" },
  ],
  EG: [
    { name: "القاهرة", value: "cairo" },
    { name: "الإسكندرية", value: "alexandria" },
    { name: "الجيزة", value: "giza" },
    { name: "بورسعيد", value: "portsaid" },
    { name: "الأقصر", value: "luxor" },
  ],
  QA: [
    { name: "الدوحة", value: "doha" },
    { name: "الريان", value: "alrayyan" },
    { name: "الوكرة", value: "alwakrah" },
  ],
  KW: [
    { name: "مدينة الكويت", value: "kuwait-city" },
    { name: "حولي", value: "hawalli" },
    { name: "الأحمدي", value: "alahmadi" },
  ],
  BH: [
    { name: "المنامة", value: "manama" },
    { name: "المحرق", value: "muharraq" },
    { name: "الرفاع", value: "alriffa" },
  ],
  OM: [
    { name: "مسقط", value: "muscat" },
    { name: "صلالة", value: "salalah" },
    { name: "نزوى", value: "nizwa" },
  ],
  IQ: [
    { name: "بغداد", value: "baghdad" },
    { name: "البصرة", value: "basra" },
    { name: "الموصل", value: "mosul" },
    { name: "أربيل", value: "erbil" },
  ],
  JO: [
    { name: "عمان", value: "amman" },
    { name: "إربد", value: "irbid" },
    { name: "الزرقاء", value: "zarqa" },
  ],
  LB: [
    { name: "بيروت", value: "beirut" },
    { name: "طرابلس", value: "tripoli" },
    { name: "صيدا", value: "saida" },
  ],
  YE: [
    { name: "صنعاء", value: "sanaa" },
    { name: "عدن", value: "aden" },
    { name: "تعز", value: "taiz" },
  ],
  SY: [
    { name: "دمشق", value: "damascus" },
    { name: "حلب", value: "aleppo" },
    { name: "اللاذقية", value: "latakia" },
  ],
  SD: [
    { name: "الخرطوم", value: "khartoum" },
    { name: "أم درمان", value: "omdurman" },
    { name: "بور سودان", value: "portsudan" },
  ],
  LY: [
    { name: "طرابلس", value: "tripoli" },
    { name: "بنغازي", value: "benghazi" },
    { name: "مصراتة", value: "misrata" },
  ],
  TN: [
    { name: "تونس", value: "tunis" },
    { name: "صفاقس", value: "sfax" },
    { name: "سوسة", value: "sousse" },
  ],
  DZ: [
    { name: "الجزائر", value: "algiers" },
    { name: "وهران", value: "oran" },
    { name: "قسنطينة", value: "constantine" },
  ],
  MA: [
    { name: "الرباط", value: "rabat" },
    { name: "الدار البيضاء", value: "casablanca" },
    { name: "مراكش", value: "marrakech" },
    { name: "فاس", value: "fes" },
  ],
};

export const citiesArray = [
  { name: "العين", value: "alain" },
  { name: "أبو ظبي", value: "abudhabi" },
  { name: "دبي", value: "dubai" },
  { name: "الرياض", value: "riyadh" },
  { name: "جدة", value: "jeddah" },
  { name: "مدينة الكويت", value: "kuwait-city" },
];

export const carType = [
  { name: "سيارات جديدة", value: "new" },
  { name: "سيارات متجرية", value: "commercial" },
  { name: "سيارات سويد", value: "suv" },
  { name: "سيارات سيدان", value: "sedan" },
  { name: "سيارات رياضية", value: "sports" },
];

export const brand = [
  { name: "تويوتا", value: "toyota" },
  { name: "هوندا", value: "honda" },
  { name: "بي ام دبليو", value: "bmw" },
  { name: "اوتوسفاند", value: "audi" },
  { name: "ايليا", value: "kia" },
  { name: "راندا��", value: "renault" },
  { name: "فارو", value: "ford" },
  { name: "بيكاردي", value: "chevrolet" },
  { name: "جيبي", value: "jeep" },
  { name: "بيكسي", value: "benz" },
  { name: "بيتشي", value: "peugeot" },
  { name: "نيسان", value: "nissan" },
  { name: "سوزوكي", value: "suzuki" },
  { name: "سيارات سويد", value: "suv" },
  { name: "سيارات سيدان", value: "sedan" },
  { name: "سيارات رياضية", value: "sports" },
];

export const price = [
  { id: 1, name: "10000 - 20000", value: "10000-20000" },
  { id: 2, name: "20001 - 30000", value: "20001-30000" },
  { id: 3, name: "30001 - 40000", value: "30001-40000" },
  { id: 4, name: "40001 - 50000", value: "40001-50000" },
  { id: 5, name: "50001 - 60000", value: "50001-60000" },
  { id: 6, name: "60001 - 70000", value: "60001-70000" },
  { id: 7, name: "70001 - 80000", value: "70001-80000" },
  { id: 8, name: "80001 - 90000", value: "80001-90000" },
  { id: 9, name: "90001 - 100000", value: "90001-100000" },
  { id: 10, name: "100001 - 110000", value: "100001-110000" },
  { id: 11, name: "110001 - 120000", value: "110001-120000" },
  { id: 12, name: "120001 - 130000", value: "120001-130000" },
  { id: 13, name: "130001 - 140000", value: "130001-140000" },
];

export const year = [
  { id: 2025, name: "2025", value: "2025" },
  { id: 2024, name: "2024", value: "2024" },
  { id: 2023, name: "2023", value: "2023" },
  { id: 2022, name: "2022", value: "2022" },
  { id: 2021, name: "2021", value: "2021" },
  { id: 2020, name: "2020", value: "2020" },
  { id: 2019, name: "2019", value: "2019" },
  { id: 2018, name: "2018", value: "2018" },
  { id: 2017, name: "2017", value: "2017" },
  { id: 2016, name: "2016", value: "2016" },
  { id: 2015, name: "2015", value: "2015" },
  { id: 2014, name: "2014", value: "2014" },
  { id: 2013, name: "2013", value: "2013" },
  { id: 2012, name: "2012", value: "2012" },
  { id: 2011, name: "2011", value: "2011" },
  { id: 2010, name: "2010", value: "2010" },
  { id: 2009, name: "2009", value: "2009" },
  { id: 2008, name: "2008", value: "2008" },
  { id: 2007, name: "2007", value: "2007" },
  { id: 2006, name: "2006", value: "2006" },
  { id: 2005, name: "2005", value: "2005" },
  { id: 2004, name: "2004", value: "2004" },
  { id: 2003, name: "2003", value: "2003" },
  { id: 2002, name: "2002", value: "2002" },
  { id: 2001, name: "2001", value: "2001" },
  { id: 2000, name: "2000", value: "2000" },
  { id: 1999, name: "1999", value: "1999" },
  { id: 1998, name: "1998", value: "1998" },
  { id: 1997, name: "1997", value: "1997" },
  { id: 1996, name: "1996", value: "1996" },
  { id: 1995, name: "1995", value: "1995" },
  { id: 1994, name: "1994", value: "1994" },
  { id: 1993, name: "1993", value: "1993" },
  { id: 1992, name: "1992", value: "1992" },
  { id: 1991, name: "1991", value: "1991" },
  { id: 1990, name: "1990", value: "1990" },
  { id: 1989, name: "1989", value: "1989" },
  { id: 1988, name: "1988", value: "1988" },
  { id: 1987, name: "1987", value: "1987" },
  { id: 1986, name: "1986", value: "1986" },
];

export const categories = [
  {
    id: "cars",
    title: "سيارات",
    image: "/Images/سيارات.png",
    href: "/cars",
  },
  {
    id: "spare-parts",
    title: "قطع غيار",
    image: "/Images/قطع غيار.png",
    href: "/spare-parts",
  },
  {
    id: "car-numbers",
    title: "ارقام سيارات",
    image: "/Images/لوحات.png",
    href: "/car-numbers",
  },
  {
    id: "services",
    title: "خدمات",
    image: "/Images/خدمات.png",
    href: "/services",
  },
  {
    id: "accident-cars",
    title: "سيارات حوادث و سكراب",
    image: "/Images/سيارات حوادث.png",
    href: "/accident-cars",
  },
  {
    id: "showrooms",
    title: "معارض",
    image: "/Images/معارض.png",
    href: "/showrooms",
  },
];

export const languages = [
  { code: "ar", name: "العربية", flag: "/Flags/United Arab Emirates (AE).png" },
  { code: "en", name: "English", flag: "/Flags/United Kingdom (GB).png" },
];

export const UserLink = [
  {
    name_ar: "حسابي",
    name_en: "My Account",
    href: "/user",
    href2: "/user/change-Password",
    image: "/Icons/identity-card.png",
    alt: "identity",
  },
  {
    name_ar: "عناويني",
    name_en: "My Addresses",
    href: "/user/address",
    href2: "/user/address/add-address",
    image: "/Icons/location.png",
    alt: "Address",
  },
  // {
  //   name_ar: "بطاقات الدفع",
  //   name_en: "My Payments",
  //   href: "/user/payment",
  //   href2: "/user/payment/add-payment",
  //   image: "/Icons/credit-card.png",
  //   alt: "payment",
  // },
  {
    name_ar: "ترقية حسابي",
    name_en: "Upgrade Account",
    href: "/user/upgrade-account",
    image: "/Icons/award-02.png",
    alt: "newt",
  },
  {
    name_ar: "حذف حسابي",
    name_en: "Delete Account",
    href: "/",
    image: "/Icons/logout-01.png",
    alt: "logout",
  },
];

// ======================= Attributes Types ======================= //
export const condition = [
  {
    id: 1,
    name_ar: "ممتازة من الداخل والخارج",
    name_en: "Excellent inside and out",
    value_en: "Excellent inside and out",
    value_ar: "ممتازة من الداخل والخارج",
  },
  {
    id: 2,
    name_ar: "بلا حوادث، مع عيوب بسيطة جدا",
    name_en: "No accidents, with very minor defects",
    value_en: "No accidents, with very minor defects",
    value_ar: "بلا حوادث، مع عيوب بسيطة جدا",
  },
  {
    id: 3,
    name_ar: "القليل من التلف، تم اصلاحه بالكامل",
    name_en: "Little damage, fully repaired",
    value_en: "Little damage, fully repaired",
    value_ar: "القليل من التلف، تم اصلاحه بالكامل",
  },
  {
    id: 4,
    name_ar: "تلف وشقوق عادية مع بعض العيوب",
    name_en: "Normal damage and cracks with some defects",
    value_en: "Normal damage and cracks with some defects",
    value_ar: "تلف وشقوق عادية مع بعض العيوب",
  },
  {
    id: 5,
    name_ar: "الكثير من التلف والأضرار الواضحة علي الجسم",
    name_en: "A lot of damage and obvious damage to the body",
    value_en: "A lot of damage and obvious damage to the body",
    value_ar: "الكثير من التلف والأضرار الواضحة علي الجسم",
  },
];

export const SubSectionsServicesType: ServicesSectionType[] = [
  {
    id: 1,
    name_ar: "خدمات عامة",
    name_en: "Public Services",
    value: "Public Services",
  },
  {
    id: 2,
    name_ar: "خدمات صيانة وإصلاح",
    name_en: "Maintenance and repair Services",
    value: "Maintenance and repair Services",
  },
  {
    id: 3,
    name_ar: "خدمات تنظيف",
    name_en: "Cleaning Services",
    value: "Cleaning Services",
  },
  {
    id: 4,
    name_ar: "خدمات نقل وشحن",
    name_en: "Moving and Shipping Services",
    value: "Moving and Shipping Services",
  },
  {
    id: "5",
    name_ar: "خدمات ونش وسطحيات",
    name_en: "Winch and deck Services",
    value: "Winch and deck Services",
  },
  {
    id: 6,
    name_ar: "اخرى",
    name_en: "Other",
    value: "Other",
  },
];

export const horsePower = [
  {
    id: 1,
    name_ar: "0 -- 100 حصان",
    name_en: "0 -- 100 Horse",
    value: "0 -- 100 Horse",
  },
  {
    id: 2,
    name_ar: "100 -- 200 حصان",
    name_en: "100 -- 200 Horse",
    value: "100 -- 200 Horse",
  },
  {
    id: 3,
    name_ar: "200 -- 300 حصان",
    name_en: "200 -- 300 Horse",
    value: "200 -- 300 Horse",
  },
  {
    id: 4,
    name_ar: "300 -- 400 حصان",
    name_en: "300 -- 400 Horse",
    value: "300 -- 400 Horse",
  },
  {
    id: 5,
    name_ar: "400 -- 500 حصان",
    name_en: "400 -- 500 Horse",
    value: "400 -- 500 Horse",
  },
  {
    id: 6,
    name_ar: "500 -- 600 حصان",
    name_en: "500 -- 600 Horse",
    value: "500 -- 600 Horse",
  },
  {
    id: 7,
    name_ar: "600 -- 700 حصان",
    name_en: "600 -- 700 Horse",
    value: "600 -- 700 Horse",
  },
  {
    id: 8,
    name_ar: "700 -- 800 حصان",
    name_en: "700 -- 800 Horse",
    value: "700 -- 800 Horse",
  },
  {
    id: 9,
    name_ar: "800 -- 900 حصان",
    name_en: "800 -- 900 Horse",
    value: "800 -- 900 Horse",
  },
  {
    id: 10,
    name_ar: "900 + حصان",
    name_en: "900 + Horse",
    value: "900 + Horse",
  },
  {
    id: 11,
    name_ar: "غير معروف",
    name_en: "Unknown",
    value: "Unknown",
  },
];

export const enginCount = [
  {
    id: 1,
    name_ar: "0-800",
    name_en: "0-800",
    value: "0-800",
  },
  {
    id: 2,
    name_ar: "1000-1300",
    name_en: "1000-1300",
    value: "1000-1300",
  },
  {
    id: 3,
    name_ar: "1400-1500",
    name_en: "1400-1500",
    value: "1400-1500",
  },
  {
    id: 4,
    name_ar: "1600",
    name_en: "1600",
    value: "1600",
  },
  {
    id: 5,
    name_ar: "1800-2000",
    name_en: "1800-2000",
    value: "1800-2000",
  },
  {
    id: 6,
    name_ar: "2000-2800",
    name_en: "2000-2800",
    value: "2000-2800",
  },
  {
    id: 7,
    name_ar: "+3000",
    name_en: "+3000",
    value: "+3000",
  },
];

export const structureType = [
  {
    id: 1,
    name_ar: "دفع رباعي",
    name_en: "SUV",
    value: "SUV",
  },
  {
    id: 2,
    name_ar: "كوبيه",
    name_en: "Coupe",
    value: "Coupe",
  },
  {
    id: 3,
    name_ar: "سيدان",
    name_en: "Sedan",
    value: "Sedan",
  },
  {
    id: 4,
    name_ar: "كروس اوفر",
    name_en: "Crossover",
    value: "Crossover",
  },
  {
    id: 5,
    name_ar: "سيارة مكشوفة ذات سقف صلب",
    name_en: "Hard-top convertible",
    value: "Hard-top convertible",
  },
  {
    id: 6,
    name_ar: "شاحنة نقل",
    name_en: "Truck",
    value: "Truck",
  },
  {
    id: 7,
    name_ar: "هاتشباك",
    name_en: "Hatchback",
    value: "Hatchback",
  },
  {
    id: 8,
    name_ar: "سيارة مكشوفة ذات سقف لين",
    name_en: "Soft-top convertible",
    value: "Soft-top convertible",
  },
  {
    id: 9,
    name_ar: "سيارة رياضية",
    name_en: "Sport car",
    value: "Sport car",
  },
  {
    id: 10,
    name_ar: "شاحنة صغيرة/ فان",
    name_en: "Mini truck/van",
    value: "Mini truck/van",
  },
  {
    id: 11,
    name_ar: "واجون",
    name_en: "Wagon",
    value: "Wagon",
  },
  {
    id: 12,
    name_ar: "شاحنة منافع",
    name_en: "Utility truck",
    value: "Utility truck",
  },
  {
    id: 13,
    name_ar: "أخري",
    name_en: "other",
    value: "other",
  },
];

export const specificationsType = [
  {
    id: 1,
    name_ar: "مواصفات خليجية",
    name_en: "Gulf specifications",
    value: "Gulf specifications",
  },
  {
    id: 2,
    name_ar: "مواصفات أمريكية",
    name_en: "American specifications",
    value: "American",
  },

  {
    id: 3,
    name_ar: "مواصفات كندية",
    name_en: "Canadian specifications",
    value: "Canadian",
  },

  {
    id: 4,
    name_ar: "مواصفات أوروبية",
    name_en: "European specifications",
    value: "European",
  },
  {
    id: 5,
    name_ar: "مواصفات يابانية",
    name_en: "Japanese specifications",
    value: "Japanese",
  },
  {
    id: 6,
    name_ar: "مواصفات أخري",
    name_en: "Other specifications",
    value: "Other",
  },
];

export const colorName = [
  {
    id: 1,
    name_ar: "ابيض",
    name_en: "white",
    value_ar: "ابيض",
    value_en: "white",
  },
  {
    id: 2,
    name_ar: "اسود",
    name_en: "black",
    value_ar: "اسود",
    value_en: "black",
  },
  {
    id: 3,
    name_ar: "احمر",
    name_en: "red",
    value_ar: "احمر",
    value_en: "red",
  },
  {
    id: 4,
    name_ar: "اصفر",
    name_en: "yellow",
    value_ar: "اصفر",
    value_en: "yellow",
  },
  {
    id: 5,
    name_ar: "برتقالي",
    name_en: "orange",
    value_ar: "برتقالي",
    value_en: "orange",
  },
  {
    id: 6,
    name_ar: "اخضر",
    name_en: "green",
    value_ar: "اخضر",
    value_en: "green",
  },
  {
    id: 7,
    name_ar: "ازرق",
    name_en: "blue",
    value_ar: "ازرق",
    value_en: "blue",
  },
  {
    id: 8,
    name_ar: "رمادي",
    name_en: "grey",
    value_ar: "رمادي",
    value_en: "grey",
  },
  {
    id: 9,
    name_ar: "سيلفر",
    name_en: "silver",
    value_ar: "سيلفر",
    value_en: "silver",
  },
  {
    id: 10,
    name_ar: "دهبي",
    name_en: "gold",
    value_ar: "دهبي",
    value_en: "gold",
  },
  {
    id: 11,
    name_ar: "بنفسجي",
    name_en: "purple",
    value_ar: "بنفسجي",
    value_en: "purple",
  },
  {
    id: 12,
    name_ar: "بني",
    name_en: "brown",
    value_ar: "بني",
    value_en: "brown",
  },
  {
    id: 13,
    name_ar: "أخري",
    name_en: "other",
    value_ar: "أخري",
    value_en: "other",
  },
];

export const numOfSeatsName = [
  {
    id: 1,
    name_ar: "2",
    name_en: "2",
    value: "2",
  },
  {
    id: 2,
    name_ar: "4",
    name_en: "4",
    value: "4",
  },
  {
    id: 3,
    name_ar: "5",
    name_en: "5",
    value: "5",
  },
  {
    id: 4,
    name_ar: "6",
    name_en: "6",
    value: "6",
  },
  {
    id: 5,
    name_ar: "7",
    name_en: "7",
    value: "7",
  },
  {
    id: 6,
    name_ar: "8",
    name_en: "8",
    value: "8",
  },
  {
    id: 7,
    name_ar: "8+",
    name_en: "8+",
    value: "8+",
  },
];

export const fuelNameType = [
  {
    id: 1,
    name_ar: "بنزين",
    name_en: "Petrol",
    value_ar: "بنزين",
    value_en: "Petrol",
  },
  {
    id: 2,
    name_ar: "ديزل",
    name_en: "Diesel",
    value_ar: "ديزل",
    value_en: "Diesel",
  },
  {
    id: 3,
    name_ar: "هجينة",
    name_en: "Hybrid",
    value_ar: "هجينة",
    value_en: "Hybrid",
  },
  {
    id: 4,
    name_ar: "كهرباء",
    name_en: "Electricity",
    value_ar: "كهرباء",
    value_en: "Electricity",
  },
];

export const BatteryCapacity = [
  {
    id: 1,
    name_ar: "أقل من 30 كيلو واط/ ساعة",
    name_en: "Less than 30 kW/ h",
    value_ar: "أقل من 30 كيلو واط/ ساعة",
    value_en: "Less than 30 kW/ h",
  },
  {
    id: 2,
    name_ar: "30 -40  كيلو واط/ ساعة",
    name_en: "30 - 40 kW/h",
    value_ar: "30 -40  كيلو واط/ ساعة",
    value_en: "30 - 40 kW/h",
  },
  {
    id: 3,
    name_ar: "40 -50  كيلو واط/ ساعة",
    name_en: "40 - 50 kW/h",
    value_ar: "40 -50  كيلو واط/ ساعة",
    value_en: "40 - 50 kW/h",
  },
  {
    id: 4,
    name_ar: "50 -60  كيلو واط/ ساعة",
    name_en: "50 - 60 kW/h",
    value_ar: "50 -60  كيلو واط/ ساعة",
    value_en: "50 - 60 kW/h",
  },
  {
    id: 5,
    name_ar: "60 -70  كيلو واط/ ساعة",
    name_en: "60 - 70 kW/h",
    value_ar: "60 -70  كيلو واط/ ساعة",
    value_en: "60 - 70 kW/h",
  },
  {
    id: 6,
    name_ar: "70 -80  كيلو واط/ ساعة",
    name_en: "70 - 80 kW/h",
    value_ar: "70 -80  كيلو واط/ ساعة",
    value_en: "70 - 80 kW/h",
  },
  {
    id: 7,
    name_ar: "80 -90  كيلو واط/ ساعة",
    name_en: "80 - 90 kW/h",
    value_ar: "80 -90  كيلو واط/ ساعة",
    value_en: "80 - 90 kW/h",
  },
  {
    id: 8,
    name_ar: "90 -100  كيلو واط/ ساعة",
    name_en: "90 - 100 kW/h",
    value_ar: "90 -100  كيلو واط/ ساعة",
    value_en: "90 - 100 kW/h",
  },
  {
    id: 9,
    name_ar: "100+ كيلو واط/ ساعة",
    name_en: "100+ kW/h",
    value_ar: "100+ كيلو واط/ ساعة",
    value_en: "100+ kW/h",
  },
  {
    id: 10,
    name_ar: "مجهول",
    name_en: "Unknown",
    value_ar: "مجهول",
    value_en: "Unknown",
  },
];

export const ChargeDuration = [
  {
    id: 1,
    name_ar: "أقل من 250 كم",
    name_en: "Less than 250 km",
    value_ar: "أقل من 250 كم",
    value_en: "Less than 250 km",
  },
  {
    id: 2,
    name_ar: "250 -350  كم",
    name_en: "250 - 350 km",
    value_ar: "250 -350  كم",
    value_en: "250 - 350 km",
  },
  {
    id: 3,
    name_ar: "350 -450  كم",
    name_en: "350 - 450 km",
    value_ar: "350 -450  كم",
    value_en: "350 - 450 km",
  },
  {
    id: 4,
    name_ar: "450 -550  كم",
    name_en: "450 - 550 km",
    value_ar: "450 -550  كم",
    value_en: "450 - 550 km",
  },
  {
    id: 5,
    name_ar: "550 -650  كم",
    name_en: "550 - 650 km",
    value_ar: "550 -650  كم",
    value_en: "550 - 650 km",
  },
  {
    id: 6,
    name_ar: "650+ كم",
    name_en: "650+ km",
    value_ar: "650+ كم",
    value_en: "650+ km",
  },
  {
    id: 7,
    name_ar: "مجهول",
    name_en: "Unknown",
    value_ar: "مجهول",
    value_en: "Unknown",
  },
];

export const ChargeRange = [
  {
    id: 1,
    name_ar: "أقل من 1 ساعة",
    name_en: "1 - 2 h",
    value_ar: "أقل من 1 ساعة",
    value_en: "1 - 2 h",
  },
  {
    id: 2,
    name_ar: "2 - 3 ساعة",
    name_en: "2 - 3 h",
    value_ar: "2 - 3 ساعة",
    value_en: "2 - 3 h",
  },
  {
    id: 3,
    name_ar: "3 - 4 ساعة",
    name_en: "3 - 4 h",
    value_ar: "3 - 4 ساعة",
    value_en: "3 - 4 h",
  },
  {
    id: 4,
    name_ar: "4 - 5 ساعة",
    name_en: "4 - 5 h",
    value_ar: "4 - 5 ساعة",
    value_en: "4 - 5 h",
  },
  {
    id: 5,
    name_ar: "5 - 6 ساعة",
    name_en: "5 - 6 h",
    value_ar: "5 - 6 ساعة",
    value_en: "5 - 6 h",
  },
  {
    id: 6,
    name_ar: "6+ ساعة",
    name_en: "6+ h",
    value_ar: "6+ ساعة",
    value_en: "6+ h",
  },
  {
    id: 7,
    name_ar: "مجهول",
    name_en: "Unknown",
    value_ar: "مجهول",
    value_en: "Unknown",
  },
];

export const SelfDriving = [
  { id: 1, name_ar: "نعم", name_en: "Yes", value_en: "Yes", value_ar: "نعم" },
  { id: 2, name_ar: "لا", name_en: "No", value_en: "No", value_ar: "لا" },
];

export const conditionPriceType = [
  {
    id: 1,
    name_ar: "متاح للتقسيط",
    name_en: "Installment",
    value_en: "Installment",
    value_ar: "القسط",
  },
  {
    id: 2,
    name_ar: "السعر نهائي",
    name_en: "Fixed Price",
    value_en: "Fixed Price",
    value_ar: "السعر نهائي",
  },
  {
    id: 3,
    name_ar: "قابل للتفاوض",
    name_en: "Negotiable",
    value_en: "Negotiable",
    value_ar: "قابل للتفاوض",
  },
];

export const cylindersCount = [
  { id: 3, name_ar: "3", name_en: "3", value_en: "3", value_ar: "3" },
  { id: 4, name_ar: "4", name_en: "4", value_en: "4", value_ar: "4" },
  { id: 5, name_ar: "5", name_en: "5", value_en: "5", value_ar: "5" },
  { id: 6, name_ar: "6", name_en: "6", value_en: "6", value_ar: "6" },
  { id: 8, name_ar: "8", name_en: "8", value_en: "8", value_ar: "8" },
  { id: 10, name_ar: "10", name_en: "10", value_en: "10", value_ar: "10" },
  { id: 12, name_ar: "12", name_en: "12", value_en: "12", value_ar: "12" },
  {
    id: 13,
    name_ar: "غير معروف",
    name_en: "Unknown",
    value_en: "Unknown",
    value_ar: "غير معروف",
  },
];

export const transmissionType = [
  { id: 1, name_ar: "اوتوماتيك", name_en: "Automatic", value: "auto" },
  { id: 2, name_ar: "يدوي", name_en: "Manual", value: "manual" },
];

export const WarrantyType = [
  { id: 1, name_ar: "يوجد", name_en: "There is", value: "true" },
  { id: 2, name_ar: "لا يوجد", name_en: "without", value: "false" },
];

export const PowerTransmissionSystemType = [
  { id: 1, name_ar: "حزام", name_en: "belt", value: "belt" },
  { id: 2, name_ar: "سلسلة", name_en: "series", value: "series" },
  { id: 3, name_ar: "عمود", name_en: "column", value: "column" },
  {
    id: 4,
    name_ar: "لا ينطبق",
    name_en: "Not applicable",
    value: "Not applicable",
  },
];

export const bikeEngineSize = [
  { id: 1, name_ar: "0-250", name_en: "0-250", value: "0-250" },
  { id: 2, name_ar: "250-499", name_en: "250-499", value: "250-499" },
  { id: 3, name_ar: "500-599", name_en: "500-599", value: "500-599" },
  {
    id: 4,
    name_ar: "600-749",
    name_en: "600-749",
    value: "600-749",
  },
  {
    id: 5,
    name_ar: "750-999",
    name_en: "750-999",
    value: "750-999",
  },
  {
    id: 6,
    name_ar: "1000+",
    name_en: "1000+",
    value: "1000+",
  },
  {
    id: 7,
    name_ar: "لا ينطبق",
    name_en: "Not applicable",
    value: "Not applicable",
  },
];

export const NumberOfTiresOfBicks = [
  { id: 1, name_ar: "2", name_en: "2", value: "2" },
  { id: 2, name_ar: "3", name_en: "3", value: "3" },
  { id: 3, name_ar: "4", name_en: "4", value: "4" },
];

export const deliveryService = [
  { id: 1, name_ar: "يوجد", name_en: "There is", value: "true" },
  { id: 2, name_ar: "بدون", name_en: "Without", value: "false" },
];

export const AllProductsTypes = [
  { id: "1", name_ar: "الكل", name_en: "All", value: "category" },
  { id: "2", name_ar: "المميز", name_en: "Featured", value: "premium" },
  { id: "3", name_ar: "الجديد", name_en: "new", value: "new" },
  { id: "4", name_ar: "الشائع", name_en: "Common", value: "mostViewed" },
];

export const sortOptions = {
  ar: [
    { value: "newest", label: "من الأحدث إلى الأقدم" },
    { value: "oldest", label: "من الأقدم إلى الأحدث" },
    { value: "price_high_to_low", label: "السعر من الأعلى إلى الأدنى" },
    { value: "price_low_to_high", label: "السعر من الأدنى إلى الأعلى" },
    {
      value: "mileage_high_to_low",
      label: "عدد الكيلومترات من الأعلى إلى الأدنى",
    },
    {
      value: "mileage_low_to_high",
      label: "عدد الكيلومترات من الأدنى إلى الأعلى",
    },
    {
      value: "manufacturing_year_high_to_low",
      label: "سنة الصنع من الأحدث إلى الأقدم",
    },
    {
      value: "manufacturing_year_low_to_high",
      label: "سنة الصنع من الأقدم إلى الأحدث",
    },
  ],
  en: [
    { value: "newest", label: "Newest to Oldest" },
    { value: "oldest", label: "Oldest to Newest" },
    { value: "price_high_to_low", label: "Price: High to Low" },
    { value: "price_low_to_high", label: "Price: Low to High" },
    {
      value: "mileage_high_to_low",
      label: "Mileage: High to Low",
    },
    {
      value: "mileage_low_to_high",
      label: "Mileage: Low to High",
    },
    {
      value: "manufacturing_year_high_to_low",
      label: "Manufacturing Year: Newest to Oldest",
    },
    {
      value: "manufacturing_year_low_to_high",
      label: "Manufacturing Year: Oldest to Newest",
    },
  ],
} as const;

export const SupportLink = [
  {
    id: 1,
    name_ar: "الاسئلة الشائعة",
    name_en: "Frequently Asked Questions",
    value: "Questions",
    href: "/SupportCenter",
  },
  {
    id: 2,
    name_ar: "الشروط والاحكام",
    name_en: "Terms and Conditions",
    value: "Terms",
    href: "/SupportCenter/terms",
  },
  {
    id: 3,
    name_ar: "تواصل معنا",
    name_en: "Contact us",
    value: "contact",
    href: "/SupportCenter/contact",
  },
  {
    id: 4,
    name_ar: "الاصدار",
    name_en: "Version",
    value: "version",
    href: "/SupportCenter/version",
  },
];

export const CategoriesData: CategoryCarsType[] = [
  {
    id: 0,
    name_en: "All",
    name_ar: "الكل",
    key: "all",
  },
  {
    id: 1,
    name_en: "Cars",
    name_ar: "سيارات",
    key: "car",
  },
  {
    id: 2,
    name_en: "Bikes",
    name_ar: "دراجات",
    key: "bikes",
  },
  {
    id: 3,
    name_en: "Trucks",
    name_ar: "شاحنات",
    key: "trucks",
  },
  {
    id: 4,
    name_en: "Boats",
    name_ar: "قوارب",
    key: "boats",
  },
];

export const TapsCategories = [
  {
    id: 1,
    name_en: "Cars",
    name_ar: "سيارات",
    key: "car",
  },
  {
    id: 2,
    name_en: "Bikes",
    name_ar: "دراجات",
    key: "bikes",
  },
  {
    id: 3,
    name_en: "Trucks",
    name_ar: "شاحنات",
    key: "trucks",
  },
  {
    id: 4,
    name_en: "Boats",
    name_ar: "قوارب",
    key: "boats",
  },
];

export const FooterPoliciesLinks = [
  {
    href: "/SupportCenter/terms",
    label_ar: "سياسة الخصوصية",
    label_en: "Privacy Policy",
  },

  {
    href: "/SupportCenter/terms",
    label_ar: "الشروط والاحكام",
    label_en: "Terms and Conditions",
  },
  {
    href: "/SupportCenter",
    label_ar: "الاسئلة الشائعة",
    label_en: "FAQ",
  },
  {
    href: "/SupportCenter/contact",
    label_ar: "تواصل معنا",
    label_en: "Contact Us",
  },
  {
    href: "/download-app",
    label_ar: "حمل التطبيق",
    label_en: "Download App",
  },
];
