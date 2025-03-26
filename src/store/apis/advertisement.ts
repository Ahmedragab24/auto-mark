import {
  ChangeStateAdvertisementType,
  ExpiredAdvertisementType,
  langType,
} from "@/types";
import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get token safely with null check to prevent runtime errors
const getUserToken = () => {
  const userData = getUserData();
  return userData?.token || null;
};

const token = getUserToken();
console.log(token);

export const advertisementApi = createApi({
  reducerPath: "advertisementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token dynamically each time to ensure we have the latest
      const token = getUserToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Images", "AdvertisementsUser"],

  endpoints: (builder) => ({
    // Add Advertisements
    AddAdvertisement: builder.mutation({
      query: (data) => ({
        url: "api/product/store",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["AdvertisementsUser"],
    }),

    // Upload Images
    StoreImages: builder.mutation({
      query: (formData) => ({
        url: "api/product/storeImages",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],
    }),

    // Get Images
    GetImages: builder.query({
      query: (productsID: number) => ({
        url: `api/products/images/${productsID}`,
      }),
      providesTags: ["Images"],
    }),

    // Delete Images
    DeleteImages: builder.mutation({
      query: (id: number) => ({
        url: `api/delete-image-product?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),

    // Get AdvertisementsUser
    GetAdvertisementsUser: builder.query({
      query: ({
        key,
        lang,
        page,
      }: {
        key: ExpiredAdvertisementType;
        lang: langType;
        page: number;
      }) => ({
        url: `api/showrooms/profile/products/?key=${key}&lang=${lang}&page=${page}`,
      }),
      providesTags: ["AdvertisementsUser"],
    }),

    // Update AdvertisementsUser
    UpdateAdvertisementsUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/products/${id}/update`,
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),

    // Change Status AdvertisementsUser
    DeleteAdvertisementsUser: builder.mutation({
      query: (productID: number) => ({
        url: `api/products/${productID}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvertisementsUser"],
    }),

    // Change Status Advertisement
    changeStatusAdvertisement: builder.mutation({
      query: ({
        productID,
        status,
      }: {
        productID: number;
        status: ChangeStateAdvertisementType;
      }) => ({
        url: `api/products/${productID}/status`,
        method: "PUT",
        body: status,
      }),
      invalidatesTags: ["AdvertisementsUser"],
    }),

    // Repost Advertisement
    RepostAdvertisement: builder.mutation({
      query: (productID: number) => ({
        url: `api/products/${productID}/repost`,
        method: "PUT",
      }),
      invalidatesTags: ["AdvertisementsUser"],
    }),

    // Report Advertisement
    ReportAdvertisement: builder.mutation({
      query: ({
        productID,
        reason,
      }: {
        productID: number;
        reason: string;
      }) => ({
        url: `api/product/${productID}/report?reason=${reason}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAddAdvertisementMutation,
  useStoreImagesMutation,
  useGetImagesQuery,
  useDeleteImagesMutation,
  useGetAdvertisementsUserQuery,
  useUpdateAdvertisementsUserMutation,
  useDeleteAdvertisementsUserMutation,
  useChangeStatusAdvertisementMutation,
  useRepostAdvertisementMutation,
  useReportAdvertisementMutation,
} = advertisementApi;
