import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCsrfToken, refreshCsrfToken } from "@/utils/csrf";
import { langType } from "@/types";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://master.automark.site",
    prepareHeaders: async (headers) => {
      await refreshCsrfToken();
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set("X-XSRF-TOKEN", csrfToken);
      }
      headers.set("X-Requested-With", "XMLHttpRequest");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ lang, formData }: { lang: langType; formData: FormData }) => ({
        url: `api/register?lang=${lang}`,
        method: "POST",
        body: formData,
      }),
    }),

    socialRegister: builder.mutation({
      query: (formData) => ({
        url: "api/social/register",
        method: "POST",
        body: formData,
      }),
    }),

    login: builder.mutation({
      query: (formData) => ({
        url: "api/login",
        method: "POST",
        body: formData,
      }),
    }),

    sendCode: builder.mutation({
      query: ({ phone, token }) => ({
        url: "api/verification-notification",
        method: "POST",
        body: { phone },
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    verifyCode: builder.mutation({
      query: ({ data, token }) => ({
        url: "api/verify-code",
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    InvitationCode: builder.query({
      query: (invitation_code: string) => ({
        url: `api/login/invitation?invitation_code=${invitation_code}`,
        method: "GET",
      }),
    }),

    OTPForDeveloper: builder.query({
      query: (email: string) => ({
        url: `api/getOtpForUser?email=${email}`,
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "api/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: "api/reset-password",
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    logout: builder.mutation({
      query: (token) => ({
        url: "api/logout",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    deleteAccount: builder.mutation({
      query: (token) => ({
        url: "api/delete-account",
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useSocialRegisterMutation,
  useLoginMutation,
  useSendCodeMutation,
  useVerifyCodeMutation,
  useInvitationCodeQuery,
  useOTPForDeveloperQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
} = AuthApi;
