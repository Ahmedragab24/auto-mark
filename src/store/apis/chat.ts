import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token = getUserData()?.token;

export const ChatApi = createApi({
  reducerPath: "ChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Chat"],
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => ({ url: "api/chats", method: "GET" }),
    }),

    getChatById: builder.query({
      query: (id) => ({ url: `api/chats/show?chat_id=${id}`, method: "GET" }),
    }),

    sendMessage: builder.mutation({
      query: (formData) => ({
        url: `api/chats/send`,
        method: "POST",
        body: formData,
        // headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    markAsRead: builder.mutation({
      query: (chat_id) => ({
        url: `api/chats/mark-as-read?chat_id=${chat_id}`,
        method: "POST",
      }),
    }),
    markAsUnreadCount: builder.query({
      query: () => ({ url: `api/chats/unread-count` }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useMarkAsUnreadCountQuery,
} = ChatApi;
