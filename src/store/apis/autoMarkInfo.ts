import { langType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const InformationApi = createApi({
  reducerPath: "InformationApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["Information", "Version", "Privacy", "Terms"],

  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Get Information By Auto Mark
    getInformation: builder.query({
      query: () => `api/settings`,
      providesTags: ["Information"],
    }),

    //   Get Information By Auto Mark
    VersionInfo: builder.query({
      query: () => `api/infoApp`,
      providesTags: ["Version"],
    }),

    //   Get Privacy
    getPrivacy: builder.query({
      query: (lang: langType) => `api/privacy?lang=${lang}`,
      providesTags: ["Privacy"],
    }),

    //   Get Terms
    getTerms: builder.query({
      query: (lang: langType) => `api/terms?lang=${lang}`,
      providesTags: ["Terms"],
    }),
  }),
});

export const {
  useGetInformationQuery,
  useVersionInfoQuery,
  useGetPrivacyQuery,
  useGetTermsQuery,
} = InformationApi;
