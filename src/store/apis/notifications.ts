import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const NotificationsApi = createApi({
  reducerPath: "NotificationsApi",
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

  tagTypes: ["Notifications"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Get Notifications
    getNotifications: builder.query({
      query: () => ({
        url: "api/notifications",
        method: "GET",
      }),
    }),

    //   Delete All Notifications
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: "api/notifications/delete-all",
        method: "DELETE",
      }),
    }),

    //   Delete  Notification By Id
    deleteNotification: builder.mutation({
      query: (id: string) => ({
        url: `api/notifications/${id}/delete`,
        method: "DELETE",
      }),
    }),

    //   MarkRed All Notification
    markAllRead: builder.mutation({
      query: () => ({
        url: `api/notifications/mark-all-read`,
        method: "POST",
      }),
    }),
  }),
});

// Export hooks for usage in function components
export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useMarkAllReadMutation,
} = NotificationsApi;
