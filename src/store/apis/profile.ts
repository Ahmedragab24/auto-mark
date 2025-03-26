import { ChangePasswordType, langType, RegisterFormData } from "@/types";
import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const ProfileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }),

  tagTypes: ["Profile"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Update Profile
    UpdateProfile: builder.mutation({
      query: ({
        formData,
        lang,
      }: {
        formData: RegisterFormData;
        lang: langType;
      }) => ({
        url: `api/updateUserInfo?lang=${lang}`,
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    //   Change Password
    ChangePassword: builder.mutation({
      query: (data: ChangePasswordType) => ({
        url: `api/changePassword`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

// Export hooks for usage in function components
export const { useUpdateProfileMutation, useChangePasswordMutation } =
  ProfileApi;
