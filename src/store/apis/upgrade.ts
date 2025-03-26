import { langType } from "@/types";
import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

export const upgradeApi = createApi({
  reducerPath: "upgradeApi",
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

  tagTypes: ["upgrade"],

  endpoints: (builder) => ({
    // Upgrade Account
    UpgradeAccount: builder.mutation({
      query: ({ lang, formData }: { lang: langType; formData: FormData }) => ({
        url: `api/upgrade-account?lang=${lang}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUpgradeAccountMutation } = upgradeApi;
