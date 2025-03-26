import { langType } from "@/types";
import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,

    prepareHeaders: (headers) => {
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["packages"],

  endpoints: (builder) => ({
    // Get packages
    AddPackages: builder.query({
      query: (lang: langType) => ({
        url: `api/product-packages?lang=${lang}`,
      }),
    }),

    // subscription package
    subscriptionPackage: builder.mutation({
      query: (formData: { packageId: number; productId: number }) => ({
        url: `api/product-packages/subscription`,
        method: "POST",
        body: formData,
      }),
    }),

    // Apply Coupon
    ApplyCoupon: builder.mutation({
      query: ({
        packge_id,
        code,
      }: {
        packge_id: number | undefined;
        code: string;
      }) => ({
        url: `api/apply-coupon?code=${code}&packge_id=${packge_id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAddPackagesQuery,
  useSubscriptionPackageMutation,
  useApplyCouponMutation,
} = packagesApi;
