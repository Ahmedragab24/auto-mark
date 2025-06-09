export interface navigationLinkType {
  title_ar: string;
  title_en: string;
  href: string;
}

export type langType = "ar" | "en";

export type CategoriesKeyType =
  | "all"
  | "car"
  | "scrap"
  | "services"
  | "showroom"
  | "showroomInfo"
  | "spare_parts"
  | "car_numbers";

export interface MainCategoriesType {
  id: number;
  key: CategoriesKeyType;
  name_en: string;
  name_ar: string;
  image?: string;
  status?: number;
  is_home?: number;
  arrange?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCarsType {
  id: number;
  image?: string;
  key: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  is_home?: number;
  subcategories?: SupCategoryCarsType[];
}

export interface SupCategoryCarsType {
  id: number;
  category_id: number;
  image: string;
  name: string;
}

export interface imagesType {
  id: number;
  image: string;
  product_id: number;
}

export interface countryType {
  id: number;
  name_ar: string;
  name_en: string;
  image?: string;
  latitude?: number;
  created_at?: string;
  status?: number;
  longitude?: number;
  symbol_ar?: string;
  symbol_en?: string;
  code?: string;
  exchange_rate?: string;
  country_tax?: string;
  updated_at?: string;
  cities?: cityType;
}

export interface cityType {
  id: number | null;
  name_ar?: string;
  name_en?: string;
  country_id?: number | null;
}

export interface cityTypeInProduct {
  id: number;
  name: string;
}

export interface countryWithProductType {
  id: number;
  name: string;
  symbol: string;
  code?: string;
  image?: string;
}

export interface sub_categoryInProductType {
  id: number;
  category_id: number;
  name_en: string;
  name_ar: string;
  image: string;
  status: number;
  is_home: number;
  created_at: string;
  updated_at: string;
}

export interface model_brandInProductType {
  id: number;
  name_en: string;
  name_ar: string;
  status?: number;
  brand_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface brandInProductType {
  id: number;
  name_en: string;
  name_ar: string;
  category_id?: number;
  image?: string;
}

export interface specificationType {
  product_id?: number;
  key: string;
  key_id?: number;
  title_en: string;
  title_ar: string;
  value_en?: string;
  value_ar?: string;
}

export interface userInProductType {
  id: number;
  name: string;
  type?: string;
  showroom_status?: string;
  phone?: string;
}

export interface SettingInProductType {
  logo: string;
  phone?: string;
  showroom_name?: string;
  showroom_status?: string;
  user_id?: number;
}

export interface ProductType {
  id?: number;
  category_id?: number;
  sub_category_id?: number;
  name?: string;
  price?: number;
  phone?: string;
  address?: string;
  image?: string;
  images?: imagesType[];
  description_en?: string;
  description_ar?: string;
  country?: countryWithProductType;
  city?: cityTypeInProduct;
  whatsapp?: string | number;
  type: string;
  created_at?: string;
  model_id?: number;
  brand_id?: number;
  days?: number;
  user_name?: string;
  motion_vector?: string;
  warranty?: number;
  city_id?: number;
  user_id?: number;
  country_id?: number;
  latitude?: string;
  longitude?: string;
  is_paid_advertisement?: boolean;
  is_favorited?: boolean;
  sub_category?: sub_categoryInProductType;
  model_brand?: model_brandInProductType;
  brand?: brandInProductType;
  standardSpecification?: specificationType[];
  standard_specification?: specificationType[];
  user?: userInProductType;
  status?: 0 | 1;
  setting?: SettingInProductType;
}

export interface relatedProductsType {
  related_products?: ProductType[];
}

export interface settingInLocationType {
  user_id?: number;
  logo?: string;
  background_image?: string;
  showroom_en?: string;
  showroom_ar?: string;
  info?: string | null;
}

export interface ShowroomByIdType {
  id: number;
  name?: string;
  type?: string;
  showroom_status?: string;
  login_type?: string;
  fcm?: string;
  device_id?: string | number;
  status?: string | boolean;
  email?: string;
  phone?: string;
  latitude?: number | string;
  longitude?: number | string;
  email_verified_at?: string;
  note?: string;
  invitation_code?: string;
  number_of_invitation_code?: number;
  points?: number;
  wallet?: number;
  info?: string;
  is_used?: number;
  category_id?: string | number;
  country_id?: number;
  city_id?: number;
  created_at?: string;
  updated_at?: string;
  setting?: settingInLocationType;
  country?: countryWithProductType;
  city?: cityType;
  products?: ProductType[];
  numberOfFollowers?: number;
  numberOfProducts?: number;
  isFollowed?: boolean;
}

export interface ShowroomFlowersType {
  showroom?: {
    id?: number;
    name?: string;
    showroom_status?: string;
    setting?: {
      id?: number;
      user_id?: number;
      logo?: string;
      name?: string;
    };
  };
  followers?: {
    current_page: number;
    data: [
      {
        id?: number;
        name?: string;
        type?: string;
        showroom_status?: string;
        is_following?: boolean;
        setting?: {
          id?: number;
          user_id?: number;
          name?: string;
          logo?: string;
        };
      }
    ];
    total?: number;
  };
  suggestions?: {
    current_page: number;
    data: [
      {
        id?: number;
        name?: string;
        type?: string;
        showroom_status?: string;
        is_following?: boolean;
        setting?: {
          id?: number;
          user_id?: number;
          name?: string;
          logo?: string;
        };
      }
    ];
    first_page_url: "https://master.automark.site/api/showrooms-follower/71?page=1";
    from: 1;
    last_page: 6;
    last_page_url: "https://master.automark.site/api/showrooms-follower/71?page=6";
    next_page_url: "https://master.automark.site/api/showrooms-follower/71?page=2";
    path: "https://master.automark.site/api/showrooms-follower/71";
    per_page: 10;
    prev_page_url: null;
    to: 10;
    total: 59;
  };
}

export interface AllShowroomsType {
  id: number;
  user_id: number;
  name: string;
  logo: string;
}

export type TypeRegister = "user" | "showroom" | "vendor";
export type TypeUser = "user" | "vendor";
export type providerRegisterType = "normal" | "google" | "apple";
export type AllProductsType = "category" | "premium" | "new" | "mostViewed";

export interface RegisterFormData {
  name: string;
  login_type?: providerRegisterType;
  type: TypeRegister;
  email: string;
  phone: string;
  iso_code: string;
  password?: string;
  showroom_en?: string;
  showroom_ar?: string;
  country_id?: number | string;
  city_id?: number | string;
  logo?: File;
  background_image?: File;
  category_id?: number | string;
  package_id?: number | string;
  fcm?: string;
  info?: string;
  longitude?: string | number;
  latitude?: string | number;
}

export interface BrandType {
  id: number;
  name_en: string;
  name_ar: string;
  category_id: number;
  image?: string;
  status?: number;
  is_home?: number;
  arrange?: number;
  created_at?: string;
  updated_at?: string;
  model_brands?: ModelsType[];
}

export interface ModelsType {
  id: number;
  name_en: string;
  name_ar: string;
  brand_id: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SubSectionsType {
  id: number;
  name: string;
  image?: string;
}

export interface ServicesSectionType {
  id: number | string | null;
  name_ar: string | null;
  name_en: string | null;
  value?: string | null;
}

export interface FilterSidebarType {
  id: number;
  title_en: string;
  title_ar: string;
  category_id: number;
  input_type?: number;
  key: string;
  hint_en?: string | null;
  hint_ar?: string | null;
  is_enable?: number;
}

export type MoreProductType = "premium" | "category" | "new" | "mostViewed";

export type sort_byType =
  | null
  | "newest"
  | "oldest"
  | "price_high_to_low"
  | "price_low_to_high"
  | "mileage_high_to_low"
  | "mileage_low_to_high"
  | "manufacturing_year_high_to_low"
  | "manufacturing_year_low_to_high";

export interface dynamicFilterType {
  key: string;
  type: string; // number || range || string
  value: string;
}

export interface FilteringProductType {
  country_id: number | null;
  city_id?: number | null;
  price_from?: number | null;
  price_to?: number | null; //1000000000
  type?: string | null; //"Negotiable"
  more_type?: MoreProductType | null; //  premium | category | new| mostViewed
  brand_id?: number | null;
  model_id?: number | null;
  //  "motion_vector" : "auto",//  auto | manual
  // "warranty" : 0
  // "sub_category_id" : 0 // accept null
  category_id: number | null; // not accept null
  dynamic_filters: dynamicFilterType[];
  sort_by: sort_byType | null;
  // newest || oldest ||price_high_to_low||price_low_to_high||mileage_high_to_low||mileage_low_to_high || manufacturing_year_high_to_low manufacturing_year_low_to_high
}

export interface AutoMarkInfo {
  id?: number;
  company_name?: string;
  email?: string;
  website_link?: string;
  company_phone?: string;
  company_address?: string;
  twitter?: string;
  facebook?: string;
  google?: string;
  commercial_id?: null | number;
  tax_id?: null | number;
  id_number?: null | number;
  linkedin?: string;
  github?: string;
  biographical_information?: string;
  logo?: string;
  background_image?: string;
  showroom_ar?: string;
  showroom_en?: string;
  isadmin?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export type ColorDirType = "external" | "internal";

export interface ColorType {
  id: number;
  name_en: string;
  type: string;
  name_ar: string;
  color_code: string;
}

export type AttributesKeyType =
  | "countries"
  | "cities"
  | "allProductsType"
  | "carType"
  | "brand"
  | "model"
  | "body_type"
  | "car_category"
  | "engine_capacity"
  | "exterior_color"
  | "interior_color"
  | "fuel_type"
  | "manufacturing_year"
  | "mileage"
  | "number_of_cylinders"
  | "number_of_seats"
  | "regional_specifications"
  | "transmission"
  | "price"
  | "condition"
  | "horsepower"
  | "engine_size"
  | "number_of_tires"
  | "power_transmission_system"
  | "service_category"
  | "auto_parts_type"
  | "auto_parts_category";

export interface AttrbuiteType {
  id: number;
  title_en: string;
  title_ar: string;
  key: AttributesKeyType;
  hint_en?: null | string;
  hint_ar?: null | string;
  is_enable?: number;
  input_type?: number;
  category_id?: number;
}

export interface ErrorType {
  data: {
    message: string;
  };
}

export interface SettingInUserDataType {
  id: number;
  background_image: string;
  info: string | null;
  logo: string;
  phone: string;
  showroom_name: string;
}

export interface UserDataType {
  id: number | null;
  city?: cityType | null;
  country: countryType | null;
  device_id?: string | number | null;
  email: string | null;
  fcm?: string | null;
  info?: string | null;
  invitation_code?: string | null;
  is_account_verified?: boolean;
  login_type?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  name: string;
  phone?: string;
  setting?: SettingInUserDataType;
  showroom_status?: string | null;
  status?: number;
  type?: TypeRegister | null;
  wallet?: number | null;
}
export interface UserTokenType {
  invitation_status?: boolean;
  message?: string;
  status_code?: number;
  token: string;
}

export type TypeAdvertisementType =
  | "car"
  | "motorcycle"
  | "truck"
  | "boat"
  | "showroom"
  | "carNumber"
  | "scrap"
  | "service"
  | "spare_parts";

export interface ChatSendType {
  user_id: number | null | undefined; // المعرف الخاص بشخص اللي هتبعتلو رساله مش اللي مسجل دخول بطلبو اجباري لو الشات اول مره يتعمل ما بينهم
  chat_id?: number | null; // بطلبو منك اجباري لو مش هتبعت user_id لو هتبعت user_id عادي ممكن متبعت الباراميتر ده او تبعتو براحتك
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any; //لو ملف او صوره ابعت النوع image وخلي الحقل ده ارفع فيه صوره عادي
  type: UploadFiletype; // ['text', 'image', 'file', 'location']
  product_id?: number | null; // بتقبل ال null
}

export interface ChangePasswordType {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface NotificationType {
  id: string | number;
  type?: string; //"App\\Notifications\\UserMessage",
  notifiable_type?: string; //"App\\Models\\User",
  notifiable_id?: number;
  data: {
    message_ar: string;
    title_ar: string;
    message_en: string;
    title_en: string;
    user_id: number;
    user_name: string;
    key: string;
    keyId: number;
  };
}

export type UploadFiletype = "text" | "image" | "file" | "location";
export interface DataInShowChatType {
  chat_id?: number;
  created_at?: string;
  id?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
  type?: UploadFiletype;
  updated_at?: string;
  user_id?: number;
}

export interface messagesINShowChatType {
  current_page?: number;
  data: DataInShowChatType[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  total: number;
}

interface ProductINShowChatType {
  id?: number;
  image?: string;
  name?: string;
  price?: number;
}

export interface ShowChatType {
  messages: messagesINShowChatType;
  product?: ProductINShowChatType;
}

export interface SettingType {
  id: number;
  background_image?: string;
  logo?: string;
  showroom_name_ar?: string;
  showroom_name_en?: string;
  phone?: string;
}

export interface AllChatTypes {
  id: number;
  unread_count: number;
  peer_user?: {
    id: number;
    name: string;
    type?: TypeRegister;
    showroom_status?: string;
    phone: string;
    setting: SettingType;
  };
  product_id: number | null;
  name: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  last_message?: {
    id: number;
    user?: {
      id: number;
      name: string;
      type: string;
      showroom_status?: string;
    };
    message?: string;
    type: string;
    created_at: string;
  };
}

export interface AutoMarkInfoType {
  background_image?: string;
  biographical_information?: string;
  commercial_id?: number | null;
  company_address?: string;
  company_name?: string;
  company_phone?: string;
  created_at?: string;
  email?: string;
  facebook?: string;
  github?: string;
  google?: string;
  id?: number;
  id_number?: number | null;
  isadmin?: number;
  linkedin?: string;
  logo?: string;
  showroom_ar?: string;
  showroom_en?: string;
  tax_id?: number | null;
  twitter?: string;
  updated_at?: string;
  user_id?: number;
  website_link?: string;
}

export type ExpiredAdvertisementType = "old" | "new";

export interface ChangeStateAdvertisementType {
  status: boolean; // true for active product , false for stop product
}

export interface PackagesType {
  id: number;
  name_en: string;
  name_ar: string;
  type: "showroom";
  description_en: string;
  description_ar: string;
  price: string;
  duration_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpgradeAccountType {
  type: TypeRegister;
  country_id: number;
  city_id: number;
  category_id?: number;
  package_id: number;
  logo?: File | null;
  background_image?: File | null;
  showroom_ar?: string;
  showroom_en?: string;
  description?: string;
}

export interface ShowroomType {
  id: number;
  category_id: number;
  city: cityType;
  city_id: number;
  country: countryType;
  country_id: number;
  created_at: string;
  device_id: string | null;
  email: string;
  email_verified_at: string | null;
  fcm: string | null;
  info: string | null;
  invitation_code: string | null;
  is_used: boolean | number;
  latitude: string | number;
  login_type: string;
  longitude: string | number;
  name: string;
  note: string | null;
  number_of_invitation_code: number;
  phone: string;
  points: number;
  products: ProductType[];
  setting: {
    user_id: number;
    logo: string;
    background_image: string;
    showroom_en: string;
    showroom_ar: string;
    info: string | null;
  };
  showroom_status: string;
  status: number;
  type: TypeRegister;
  updated_at: string;
  wallet: number;
}
