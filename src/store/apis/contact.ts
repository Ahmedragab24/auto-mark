import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const contactApi = createApi({
  reducerPath: "contactApi",
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

  endpoints: (builder) => ({
    // Contact endpoint
    Contact: builder.mutation({
      query: (data: {
        name: string;
        phone: string;
        subject: string;
        message: string;
        email: string;
      }) => ({
        url: "api/contact",
        method: "POST",
        params: {
          name: data.name,
          phone: data.phone,
          subject: data.subject || "_",
          message: data.message,
          email: data.email,
        },
      }),
    }),
  }),
});

// Export hooks for usage in function components
export const { useContactMutation } = contactApi;
