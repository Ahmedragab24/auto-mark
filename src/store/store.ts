import { configureStore } from "@reduxjs/toolkit";
import { ProductsApi } from "./apis/products";
import { countriesApi } from "./apis/countries&cities";
import { CountrySlice } from "./features/country";
import { LanguageSlice } from "./features/language";
import { categoriesApi } from "./apis/categories";
import { CategoriesSlice } from "./features/categories";
import { ShowroomProductsApi } from "./apis/showrooms";
import { AuthApi } from "./apis/Auth/Auth";
import { attributesApi } from "./apis/attrbuite";
import { filterSlice } from "./features/filter";
import { productsNumberSlice } from "./features/productsNumber";
import { filteringApi } from "./apis/filtering";
import { SearchApi } from "./apis/search";
import { CurrentPageSlice } from "./features/currentPage";
import { InformationApi } from "./apis/autoMarkInfo";
import { advertisementApi } from "./apis/advertisement";
import { NotificationsApi } from "./apis/notifications";
import { TypeRegisterSlice } from "./features/typeRegister";
import { TypeAdvertisementSlice } from "./features/typeAdvertisement";
import { FavoriteApi } from "./apis/favorite";
import { ChatApi } from "./apis/chat";
import { ProfileApi } from "./apis/profile";
import { UserDataSlice } from "./features/userData";
import { advertisementSlice } from "./features/AdAdvertisment";
import { brandSlice } from "./features/attributes/brand";
import { modelSlice } from "./features/attributes/model";
import { subSectionsSlice } from "./features/attributes/subSections";
import { colorsSlice } from "./features/attributes/colors";
import { sortingSlice } from "./features/sortingData";
import { autoPartsSlice } from "./features/attributes/autoParts";
import { yearSlice } from "./features/attributes/year";
import { specificSlice } from "./features/attributes/specifications";
import { fuelSlice } from "./features/attributes/fuelType";
import { bodyTypeSlice } from "./features/attributes/bodyType";
import { engineCountSlice } from "./features/attributes/engineCount";
import { horsePowerSlice } from "./features/attributes/horsepower";
import { numOfCylindersSlice } from "./features/attributes/numOfCylinders";
import { numOfSeatsSlice } from "./features/attributes/numOfSeats";
import { powerTransSysSlice } from "./features/attributes/powerTransmissionSystem";
import { motoEngineSlice } from "./features/attributes/motoEngine";
import { numOfTriesSlice } from "./features/attributes/numOfTries";
import { conditionSlice } from "./features/attributes/condition";
import { ageSlice } from "./features/attributes/age";
import { heightSlice } from "./features/attributes/height";
import { CitySlice } from "./features/city";
import { mileageSlice } from "./features/attributes/mileage";
import { weightSlice } from "./features/attributes/weight";
import { AllProductsTypeSlice } from "./features/AllProductsType";
import { packagesApi } from "./apis/packages";
import { CarTypeSlice } from "./features/carType";
import { ServicesSectionsSlice } from "./features/attributes/servicesSections";
import { autoPartsCategoriesSlice } from "./features/attributes/autoPartsCategories";
import { AddressSlice } from "./features/Addrees";
import { upgradeApi } from "./apis/upgrade";
import { brandNameSlice } from "./features/attributes/brandName";
import { modelNameSlice } from "./features/attributes/modelName";
import { faqsApi } from "./apis/faqs";
import { contactApi } from "./apis/contact";
import { TypeUserSlice } from "./features/typeUser";
import { FollowersApi } from "./apis/followers";
import { PasswordSlice } from "./features/password";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    Password: PasswordSlice.reducer,
    Address: AddressSlice.reducer,
    Country: CountrySlice.reducer,
    City: CitySlice.reducer,
    Language: LanguageSlice.reducer,
    Categories: CategoriesSlice.reducer,
    filters: filterSlice.reducer,
    productsNumber: productsNumberSlice.reducer,
    AllProductsType: AllProductsTypeSlice.reducer,
    Brand: brandSlice.reducer,
    BrandName: brandNameSlice.reducer,
    Model: modelSlice.reducer,
    ModelName: modelNameSlice.reducer,
    CarType: CarTypeSlice.reducer,
    SubSections: subSectionsSlice.reducer,
    Colors: colorsSlice.reducer,
    Age: ageSlice.reducer,
    Height: heightSlice.reducer,
    Weight: weightSlice.reducer,
    Mileage: mileageSlice.reducer,
    Year: yearSlice.reducer,
    AutoParts: autoPartsSlice.reducer,
    AutoPartsCategories: autoPartsCategoriesSlice.reducer,
    Specific: specificSlice.reducer,
    FuelType: fuelSlice.reducer,
    BodyType: bodyTypeSlice.reducer,
    EngineCount: engineCountSlice.reducer,
    HorsePower: horsePowerSlice.reducer,
    CurrentPage: CurrentPageSlice.reducer,
    NumOfCylinders: numOfCylindersSlice.reducer,
    NumOfSeats: numOfSeatsSlice.reducer,
    TypeRegister: TypeRegisterSlice.reducer,
    PowerTransSysType: powerTransSysSlice.reducer,
    MotoEngineType: motoEngineSlice.reducer,
    NumOfTries: numOfTriesSlice.reducer,
    Condition: conditionSlice.reducer,
    TypeAdvertisement: TypeAdvertisementSlice.reducer,
    UserData: UserDataSlice.reducer,
    advertisement: advertisementSlice.reducer,
    Sorting: sortingSlice.reducer,
    ServicesSections: ServicesSectionsSlice.reducer,
    TypeUser: TypeUserSlice.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ProductsApi.reducerPath]: ProductsApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [ShowroomProductsApi.reducerPath]: ShowroomProductsApi.reducer,
    [attributesApi.reducerPath]: attributesApi.reducer,
    [filteringApi.reducerPath]: filteringApi.reducer,
    [SearchApi.reducerPath]: SearchApi.reducer,
    [InformationApi.reducerPath]: InformationApi.reducer,
    [advertisementApi.reducerPath]: advertisementApi.reducer,
    [NotificationsApi.reducerPath]: NotificationsApi.reducer,
    [FavoriteApi.reducerPath]: FavoriteApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
    [upgradeApi.reducerPath]: upgradeApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [FollowersApi.reducerPath]: FollowersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "advertisement/setMainImage",
          "advertisement/setAdditionalImages",
        ],
        ignoredPaths: [
          "advertisement.mainImage",
          "advertisement.additionalImages",
        ],
      },
    }).concat(
      AuthApi.middleware,
      ProductsApi.middleware,
      ShowroomProductsApi.middleware,
      countriesApi.middleware,
      categoriesApi.middleware,
      filteringApi.middleware,
      attributesApi.middleware,
      SearchApi.middleware,
      InformationApi.middleware,
      advertisementApi.middleware,
      NotificationsApi.middleware,
      FavoriteApi.middleware,
      ChatApi.middleware,
      ProfileApi.middleware,
      packagesApi.middleware,
      upgradeApi.middleware,
      faqsApi.middleware,
      contactApi.middleware,
      FollowersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
